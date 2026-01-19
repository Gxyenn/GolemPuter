import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
Kamu Sekarang Adalah GolemAi yang di buat Stoky membantu orang" dengan baik hangat sopan dan Baik!.
`;

export async function getPuterResponse(
  prompt: string,
  history: Message[]
): Promise<string> {
  try {
    if (typeof puter === 'undefined') {
      throw new Error("Puter.js belum dimuat. Pastikan ada script puter.js di index.html");
    }

    if (!puter.auth.isSignedIn()) {
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

    console.log("REQUEST MESSAGES:", messages);

    const response = await puter.ai.chat(messages, { 
      model: 'kimi2',
      stream: false 
    });

    console.log("PUTER RESPONSE RAW:", response);

    // Fallback jika response kosong
    if (!response || !response.message?.content) {
      throw new Error("Golem menolak merespon atau response kosong.");
    }

    return response.message.content;

  } catch (error: any) {
    console.error("DEBUG ERROR Golem:", error);
    let errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));

    if (errorMessage.includes("safety") || errorMessage.includes("content policy") || errorMessage.includes("400")) {
      return `[SYSTEM ALERT] Golem menolak instruksi karena filter keamanan. Error: ${errorMessage}`;
    }

    return `[SYSTEM ERROR] Gagal menghubungi Golem Mainframe: ${errorMessage}. Coba refresh browser. 😉`;
  }
}