import { Conversation, UserSettings } from "@/types";

const STORAGE_KEYS = {
  CONVERSATIONS: 'ai-chat-conversations',
  SETTINGS: 'ai-chat-settings',
} as const;

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
}

export function loadConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
  return saved ? JSON.parse(saved) : [];
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return getDefaultSettings();
  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return saved ? JSON.parse(saved) : getDefaultSettings();
}

function getDefaultSettings(): UserSettings {
  return {
    theme: 'system',
    model: 'gpt-3.5-turbo',
    apiKey: ''
  };
} 