import { Conversation, UserSettings } from "@/types";
import { auth } from "@/lib/firebase";

const STORAGE_KEYS = {
  SETTINGS: "ai-chat-settings",
} as const;

// Generate a unique key for storing conversations per user
function getUserStorageKey(): string | null {
  const user = auth.currentUser;
  return user ? `ai-chat-conversations-${user.uid}` : null;
}

// Save conversations to localStorage, namespaced by UID
export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;

  const storageKey = getUserStorageKey();
  if (!storageKey) return;

  localStorage.setItem(storageKey, JSON.stringify(conversations));
}

// Load conversations from localStorage, namespaced by UID
export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];

  const storageKey = getUserStorageKey();
  if (!storageKey) return [];

  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : [];
}

// Save user settings (global/local)
export function saveSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Load user settings (global/local)
export function loadSettings(): UserSettings {
  if (typeof window === "undefined") return getDefaultSettings();
  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return saved ? JSON.parse(saved) : getDefaultSettings();
}

// Default settings
function getDefaultSettings(): UserSettings {
  return {
    theme: "system",
    model: "gpt-3.5-turbo",
    apiKey: "",
  };
}
