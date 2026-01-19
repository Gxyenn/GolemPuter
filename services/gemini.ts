import { Message } from "../types"

declare const puter: any

const SYSTEM_INSTRUCTION = `
Kamu adalah GolemAI buatan Stoky.
Bersikap ceria, ramah, sopan, dan gunakan bahasa Indonesia gaul tapi santun.
`

export async function getGeminiResponse(
  prompt: string,
  history: Message[]
): Promise<string> {
  try {
    let fullPrompt = `System: ${SYSTEM_INSTRUCTION}\n\n`

    history.slice(-10).forEach(m => {
      fullPrompt += `${m.role === 'user' ? 'User' : 'GolemAI'}: ${m.content}\n`
    })

    fullPrompt += `User: ${prompt}\nGolemAI:`

    const res = await puter.ai.chat(fullPrompt, {
      model: "moonshotai/kimi-k2"
    })

    if (typeof res === "string") return res
    if (res?.message?.content) return res.message.content

    return JSON.stringify(res)
  } catch (e: any) {
    return `⚠️ Puter AI error / kuota guest habis.\n${e.message}`
  }
}