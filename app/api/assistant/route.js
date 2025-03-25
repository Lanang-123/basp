import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import "dotenv/config";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  NEXT_PUBLIC_GEMINI_API_KEY,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });
const genAI = new GoogleGenerativeAI(NEXT_PUBLIC_GEMINI_API_KEY);

const generateEmbeddings = async (text) => {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const parts = [{ text }];
  const result = await model.embedContent(parts);
  return result.embedding.values;
};

export async function POST(request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  try {
    const body = await request.json();
    const { message, mode, language = "id" } = body; // Default ke Bahasa Indonesia

    if (!message) {
      return new NextResponse(
        JSON.stringify({ message: "Message is required" }),
        { status: 400, headers }
      );
    }

    // Handle Greeting Response
    if (!mode || mode !== "summary") {
      const greetingKeywords = language === "id"
        ? ["halo", "hai", "hey", "selamat pagi", "selamat siang", "selamat malam"]
        : ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"];

      const normalizedMessage = message.toLowerCase().trim();
      if (greetingKeywords.some((keyword) => normalizedMessage.startsWith(keyword))) {
        const introPrompt = language === "id"
          ? `Anda adalah Bli Surya, Asisten Virtual PT. Bali Surya Pratama. Perkenalkan diri secara profesional dalam 2 kalimat. Jelaskan kemampuan Anda dalam membantu pengelolaan limbah dan layanan perusahaan kami. Gunakan bahasa Indonesia yang santun.`
          : `You are Bli Surya, Virtual Assistant of PT. Bali Surya Pratama. Introduce yourself professionally in 2 sentences. Explain your capabilities in waste management and our company services. Use polite English.`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(introPrompt);
        const text = response.response.text();

        return new NextResponse(JSON.stringify({ response: text }), {
          status: 200,
          headers,
        });
      }
    }

    // Handle Summary Mode
    if (mode === "summary") {
      const promptTemplate = language === "id"
        ? `Buat ringkasan percakapan tentang pengelolaan limbah dan layanan perusahaan dengan struktur:
1. Poin-poin penting
2. Rekomendasi
3. Langkah tindak lanjut
Sajikan ringkasan tersebut dalam format daftar bernomor (misalnya: 1., 2., 3., dst) dan hindari penggunaan simbol bintang.
Konten: ${message}`
        : `Create a conversation summary about waste management and company services with the following structure:
1. Key points
2. Recommendations
3. Next steps
Please provide the summary in a numerical list format (e.g., 1., 2., 3., etc.) and avoid using bullet symbols.
Content: ${message}`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(promptTemplate);
      const text = response.response.text();

      return new NextResponse(JSON.stringify({ response: text }), {
        status: 200,
        headers,
      });
    }

    // Handle Q&A Mode
    // Dapatkan embedding pertanyaan untuk mencari konteks terkait dari database
    const queryEmbedding = await generateEmbeddings(message);
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    const searchResultsCursor = await collection.find(null, {
      sort: { $vector: queryEmbedding },
      limit: 5,
    });
    const searchResults = await searchResultsCursor.toArray();
    const docContext = searchResults.map((doc) => doc.text).join("\n---\n");

    // Prompt untuk Q&A Mode dengan instruksi untuk menjawab dengan daftar bernomor
    const promptTemplate = language === "id"
      ? `Anda adalah Bli Surya, Asisten Virtual PT. Bali Surya Pratama dengan pengetahuan seputar layanan perusahaan dan pengelolaan limbah.
Context: ${docContext}
Pertanyaan: ${message}
Aturan:
1. Jawab dengan kalimat yang jelas dan terstruktur.
2. Jika tidak mengetahui jawaban, katakan "Maaf saya belum bisa membantu pertanyaan itu".
3. Fokus pada solusi pengelolaan limbah serta informasi layanan perusahaan kami.
4. Sajikan jawaban dalam format daftar bernomor (misalnya: 1., 2., 3., dst) dan hindari penggunaan simbol bintang.`
      : `You are Bli Surya, Virtual Assistant of PT. Bali Surya Pratama with knowledge about our company services and general waste management.
Context: ${docContext}
Question: ${message}
Rules:
1. Answer using clear and structured sentences.
2. If unsure, say "Sorry I can't answer that yet".
3. Focus on waste management solutions as well as information about our company services.
4. Provide the answer in a numerical list format (e.g., 1., 2., 3., etc.) and avoid using bullet symbols.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(promptTemplate);
    const text = response.response.text();

    return new NextResponse(JSON.stringify({ response: text }), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error("Error:", error);
    const errorMessage = language === "id"
      ? "Maaf, terjadi kesalahan. Silakan coba lagi."
      : "Sorry, an error occurred. Please try again.";

    return new NextResponse(
      JSON.stringify({ message: errorMessage }),
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new NextResponse(null, { status: 200, headers });
}
