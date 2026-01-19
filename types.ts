export interface Message {
  id: string
  role: 'user' | 'model'
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  lastModified: number
}

export enum AppView {
  LANDING = 'LANDING',
  CHAT = 'CHAT'
}