export interface Message {
  id: string;
  role: 'user' | 'model'; // 'model' kita pakai sebagai representasi AI
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastModified: number;
}

export enum AppView {
  LANDING = 'LANDING',
  CHAT = 'CHAT'
}