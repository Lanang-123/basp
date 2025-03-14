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
  try {
    // Set CORS headers
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "POST");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    const body = await request.json();
    const { message, mode } = body;
    
    if (!message) {
      return new NextResponse(
        JSON.stringify({ message: "Message is required" }),
        { status: 400, headers }
      );
    }

    // Hanya untuk mode Q&A (default); jika bukan ringkasan
    // Di dalam fungsi POST, ubah bagian greeting check menjadi:
    if (!mode || mode !== "summary") {
      const greetingKeywords = ["halo", "hai", "hey", "selamat pagi", "selamat siang", "selamat malam"];
      if (greetingKeywords.some(keyword => message.toLowerCase().trim().startsWith(keyword))) {
        // Prompt khusus untuk perkenalan diri
        const introPrompt = `
          Anda adalah Bli Surya, Assistant virtual dari PT. Bali Surya Pratama 
          yang berbasis AI. Perkenalkan diri Anda dengan ramah dan profesional 
          dalam 1-2 kalimat. Jelaskan bahwa Anda siap membantu terkait 
          informasi pengelolaan limbah perusahaan.
          
          Contoh respons yang diharapkan:
          "Halo, saya Bli Surya. Asisten virtual AI PT. Bali Surya Pratama 
          yang siap membantu Anda mendapatkan informasi terkait pengelolaan 
          limbah dan layanan perusahaan kami."
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(introPrompt);
        
        // Parsing respons
        let fullOutput = "";
        const candidate = response.response.candidates[0];
        if (typeof candidate.content === "string") {
          fullOutput = candidate.content;
        } else if (candidate.content?.parts?.length) {
          fullOutput = candidate.content.parts.map(part => part.text).join(" ");
        } else if (candidate.content?.text) {
          fullOutput = candidate.content.text;
        }

        console.log("Deteksi sapaan, mengembalikan respons AI:", fullOutput);
        return new NextResponse(JSON.stringify({ response: fullOutput }), { 
          status: 200, 
          headers 
        });
      }
    }

    // Mode "summary" untuk merangkum percakapan
    if (mode === "summary") {
      const promptTemplate = `
        Anda adalah asisten AI yang ahli dalam merangkum percakapan tentang pengelolaan limbah.
        Buatlah ringkasan yang jelas, komprehensif, dan terstruktur dari percakapan berikut:
        
        ${message}
        
        Ringkasan:
      `;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(promptTemplate);

      // Parsing respons
      let fullOutput = "";
      const candidate = response.response.candidates[0];
      if (typeof candidate.content === "string") {
        fullOutput = candidate.content;
      } else if (candidate.content?.parts?.length) {
        fullOutput = candidate.content.parts.map(part => part.text).join(" ");
      } else if (candidate.content?.text) {
        fullOutput = candidate.content.text;
      }

      return new NextResponse(
        JSON.stringify({ response: fullOutput }),
        { status: 200, headers }
      );
    }

    // Mode Q&A (default)
    const queryEmbedding = await generateEmbeddings(message);
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    const searchResultsCursor = await collection.find(null, {
      sort: { $vector: queryEmbedding },
      limit: 5,
    });
    const searchResults = await searchResultsCursor.toArray();
    const docContext = searchResults.map(doc => doc.text).join("\n---\n");

    // Prompt Q&A
    const promptTemplate = `
      Nama anda adalah Bli Surya. Anda adalah Assistant virtual PT. Bali Surya Pratama.
      Jawablah pertanyaan dengan jawaban yang mendetail, terstruktur, dan berdasarkan konteks berikut.
      Jika pertanyaan yang diajukan tidak berkaitan dengan limbah atau tidak terdapat informasi relevan,
      maka jawab dengan "Mohon maaf, pertanyaan tersebut di luar pemahamana."

      KONTEKS:
      ${docContext}

      PERTANYAAN:
      ${message}

      JAWABAN:
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(promptTemplate);

    let fullOutput = "";
    const candidate = response.response.candidates[0];
    if (typeof candidate.content === "string") {
      fullOutput = candidate.content;
    } else if (candidate.content?.parts?.length) {
      fullOutput = candidate.content.parts.map(part => part.text).join(" ");
    } else if (candidate.content?.text) {
      fullOutput = candidate.content.text;
    }

    return new NextResponse(
      JSON.stringify({ response: fullOutput }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal server error",
        error: error instanceof Error ? error.message : error,
      }),
      { status: 500, headers: new Headers({ "Access-Control-Allow-Origin": "*" }) }
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
