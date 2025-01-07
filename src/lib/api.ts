import { UserSettings } from "@/types";
import { loadSettings } from "./storage";

export async function sendMessage(
  payload: { message: string; prompt?: string }, // Allow `prompt` to be optional
  onProgress?: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const settings = loadSettings();
  if (!settings.apiKey) {
    throw new Error("API key not found. Please add your API key in settings.");
  }

  const body: any = {
    message: payload.message,
    apiKey: settings.apiKey,
    model: settings.model,
  };

  if (payload.prompt) {
    body.prompt = payload.prompt; // Include the prompt only if it exists
  }

try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      result += chunk;
      onProgress?.(chunk);
    }

    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export async function generateTitle(message: string): Promise<string> {
  const settings = loadSettings();
  if (!settings.apiKey) {
    throw new Error('API key not found');
  }

  const selectedModel = settings.selectedModel || settings.model || 'gpt-3.5-turbo'; // Default to gpt-3.5-turbo if no model is selected

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: selectedModel, // Use the dynamically chosen model
      messages: [
        {
          role: 'system',
          content: 'Generate a short, concise title (max 6 words) for this conversation based on the user message.',
        },
        { role: 'user', content: message },
      ],
      max_tokens: 20,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
} 