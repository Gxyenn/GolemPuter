import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
Kamu Sekarang Adalah GolemAi yang di buat Stoky membantu orang" dengan baik hangat sopan dan Baik!.
`;

export async function getPuterResponse(
  prompt: string,
  history: Message[]
): Promise<string> {
  try {
    // Cek ketersediaan Puter.js
    if (typeof puter === 'undefined') {
      throw new Error("Puter.js belum dimuat. Pastikan ada script puter.js di index.html");
    }

    // Cek login (Kimi kadang butuh user login di puter.com)
    if (!puter.auth.isSignedIn()) {
      // Opsi: Sign in diam-diam atau biarkan guest (tergantung limit)
      // await puter.auth.signIn(); 
      console.warn("User belum login ke Puter, limit mungkin terbatas.");
    }

    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    console.log("Mengirim request ke Kimi...");

    // Menggunakan Model 'kimi' sesuai permintaan
    const response = await puter.ai.chat(messages, { 
      model: 'kimi2',
      stream: false 
    });

    if (!response || !response.message) {
      throw new Error("Kimi menolak merespon (Mungkin terkena filter safety).");
    }

    return response.message.content;

  } catch (error: any) {
  console.error("DEBUG ERROR KIMI:", error);

  // Ambil message asli kalau ada, kalau object convert ke JSON string
  let errorMessage = error?.message || JSON.stringify(error) || String(error);

  // Filter khusus safety/content
  if (errorMessage.includes("safety") || errorMessage.includes("content policy") || errorMessage.includes("400")) {
    return `[SYSTEM ALERT] Kimi menolak instruksi karena filter keamanan. Error: ${errorMessage}`;
  }

  return `[SYSTEM ERROR] Gagal menghubungi Kimi Mainframe: ${errorMessage}. Coba refresh browser. ☠️`;
}
}