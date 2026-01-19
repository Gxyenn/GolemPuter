import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ChatSession, Message } from "../types"
import { getGeminiResponse } from "../services/gemini"

const ChatInterface = ({
  chats,
  activeChatId,
  onUpdateChat
}: {
  chats: ChatSession[]
  activeChatId: string | null
  onUpdateChat: (c: ChatSession) => void
}) => {
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const chat = chats.find(c => c.id === activeChatId)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat?.messages, typing])

  const send = async () => {
    if (!input.trim() || !chat || typing) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: Date.now()
    }

    const updated = {
      ...chat,
      messages: [...chat.messages, userMsg],
      lastModified: Date.now()
    }

    onUpdateChat(updated)
    setInput("")
    setTyping(true)

    const aiText = await getGeminiResponse(input, chat.messages)

    updated.messages.push({
      id: crypto.randomUUID(),
      role: "model",
      content: aiText,
      timestamp: Date.now()
    })

    onUpdateChat({ ...updated })
    setTyping(false)
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chat?.messages.map(m => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" && "flex-row-reverse"}`}>
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-lg">
              {m.role === "user" ? <User size={16}/> : <Bot size={16}/>}
            </div>
            <div className="max-w-[75%] bg-zinc-900 p-4 rounded-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-3">
            <Bot/>
            <Loader2 className="animate-spin"/>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div className="p-4 border-t border-white/10 flex gap-2">
        <textarea
          className="flex-1 bg-transparent border rounded-lg p-3"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
        />
        <button onClick={send}>
          <Send/>
        </button>
      </div>
    </div>
  )
}

export default ChatInterface