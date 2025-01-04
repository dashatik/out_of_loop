import { User as FirebaseUser } from "firebase/auth";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
};

export type ChatMode = {
  id: string;
  name: string;
  description: string;
  prompt: string;
};


export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  chatMode: ChatMode; // Assuming ChatMode is already defined
  prompt: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserSettings = {
  apiKey: string;
  model: "gpt-3.5-turbo" | "gpt-4" | "claude-3-opus" | "claude-3-sonnet";
  theme: "light" | "dark" | "system";
};

// Extend Firebase User to include additional fields
export type AuthUser = FirebaseUser & {
  displayName?: string;
};

// Context type for Firebase Auth
export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
};
