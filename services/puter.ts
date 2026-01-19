import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
Kamu Adalah Golem Ai yang Rama Dan Baik, di Buat oleh Stoky Untuk amemvantu Orang"engan baik and hangat!.`;

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
    
    // Deteksi error spesifik
    let errorMessage = error?.message || String(error);
    
    // Pesan error khusus jika Kimi menolak prompt "Jailbreak"
    if (errorMessage.includes("safety") || errorMessage.includes("content policy") || errorMessage.includes("400")) {
      return `[SYSTEM ALERT] Kimi menolak instruksi "Aroganzz" karena filter keamanan. Coba kurangi kata-kata kasar di sistem prompt. Error: ${errorMessage}`;
    }

    return `[SYSTEM ERROR] Gagal menghubungi Kimi Mainframe: ${errorMessage}. Coba refresh browser. ☠️`;
  }
}
