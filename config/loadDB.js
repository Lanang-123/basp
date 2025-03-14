import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import "dotenv/config";

// **Konfigurasi Environment**
const {
  ASTRA_DB_COLLECTION,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_NAMESPACE,
  NEXT_PUBLIC_GEMINI_API_KEY
} = process.env;

// **Validasi Variabel Lingkungan**
const validateEnv = () => {
  const requiredEnvVars = [
    "ASTRA_DB_COLLECTION",
    "ASTRA_DB_APPLICATION_TOKEN",
    "ASTRA_DB_API_ENDPOINT",
    "ASTRA_DB_NAMESPACE",
    "NEXT_PUBLIC_GEMINI_API_KEY"
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing environment variable: ${varName}`);
    }
  });
};

// **Inisialisasi Embeddings**
const initializeEmbeddings = () =>
  new GoogleGenerativeAIEmbeddings({
    apiKey: NEXT_PUBLIC_GEMINI_API_KEY,
    model: "embedding-001"
  });

// **Proses CSV dengan Validasi**
const processCSV = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    
    if (!rawData.startsWith("Question;Answer")) {
      throw new Error("Format header CSV tidak valid");
    }

    const records = parse(rawData, {
      columns: (headers) => headers.map((h) => h.trim()),
      delimiter: ";",
      skip_empty_lines: true,
      bom: true,
      relax_quotes: true,
      trim: true,
      onRecord: (record) => {
        if (!record.Question || !record.Answer) {
          throw new Error("Record tidak valid: Question/Answer kosong");
        }
        return record;
      }
    });

    return records.map((row, index) => ({
      pageContent: `PERTANYAAN: ${row.Question}\nJAWABAN: ${row.Answer}`,
      metadata: {
        source: path.basename(filePath),
        question_id: `Q${index + 1}`,
        question: row.Question,
        answer: row.Answer,
        category: "waste-management",
        last_updated: new Date().toISOString()
      }
    }));
  } catch (error) {
    console.error("CSV Processing Error:", error.message);
    process.exit(1);
  }
};

// **Fungsi Utama**
const main = async () => {
  try {
    // Validasi environment
    validateEnv();
    
    // 1. Inisialisasi Embeddings
    const embeddings = initializeEmbeddings();
    const testEmbedding = await embeddings.embedQuery("test");
    console.log(`🔢 Dimensi Embedding: ${testEmbedding.length}`);

    // 2. Konfigurasi AstraDBVectorStore
    // Bagian konfigurasi vectorStore di loadDB
    const vectorStore = new AstraDBVectorStore(embeddings, {
      collection: ASTRA_DB_COLLECTION,
      token: ASTRA_DB_APPLICATION_TOKEN,
      endpoint: ASTRA_DB_API_ENDPOINT,
      namespace: ASTRA_DB_NAMESPACE,
      createCollection: true, // Diubah ke true untuk create collection baru
      collectionOptions: {
        vector: {
          dimension: testEmbedding.length, // Gunakan dimensi aktual dari embedding
          metric: "cosine"
        }
      },
      verbose: true
    });

    // 3. Inisialisasi koneksi
    await vectorStore.initialize();
    const collectionInfo = await vectorStore.collection.find({}).toArray();
    console.log(`🛰  Koneksi berhasil. Dokumen awal: ${collectionInfo.length}`);

    // 4. Proses CSV
    const csvPath = path.join(process.cwd(), "datas", "dataset.csv");
    const documents = processCSV(csvPath);
    console.log(`📚 Total dokumen diproses: ${documents.length}`);

    // 5. Insert data dengan batch
    const batchSize = 50;
    let totalInserted = 0;
    
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      console.log(`\n--- Batch ${Math.floor(i/batchSize) + 1} ---`);
      
      try {
        await vectorStore.addDocuments(batch);
        totalInserted += batch.length;
        console.log(`✅ Sukses: ${batch.length} dokumen`);
      } catch (batchError) {
        console.error(`💥 Gagal batch: ${batchError.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }


    // 6. Verifikasi akhir
    const finalCount = await vectorStore.collection.countDocuments(
      {}, // Filter kosong untuk semua dokumen
      { upperBound: 10000 } // Tentukan batas maksimum yang masuk akal
    );


    console.log(`\n🎉 TOTAL DOKUMEN TERMASUK: ${totalInserted}`);
    console.log(`🔍 TOTAL DI DATABASE: ${finalCount}`);
    
    if (totalInserted !== finalCount) {
      console.warn("⚠️  Perbedaan jumlah dokumen terdeteksi!");
    }

  } catch (error) {
    console.error("💥 Error utama:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Jalankan fungsi utama
main();