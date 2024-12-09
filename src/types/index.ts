export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
};

export type UserSettings = {
  apiKey: string;
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3-opus' | 'claude-3-sonnet';
  theme: 'light' | 'dark' | 'system';
}; 