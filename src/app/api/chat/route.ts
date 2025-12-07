import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

// Rate limiting map (in-memory, resets on deployment)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function POST(req: Request) {
  try {
    const { message, apiKey, model, prompt, userId } = await req.json();

    // Basic authentication check - verify userId is provided
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Rate limiting
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);

    if (userLimit) {
      if (now < userLimit.resetTime) {
        if (userLimit.count >= RATE_LIMIT) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        }
        userLimit.count++;
      } else {
        rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 401 });
    }

    if (!prompt) {
      console.warn("Prompt is missing. Ensure the frontend sends the correct data.");
      return NextResponse.json({ error: "Prompt not provided" }, { status: 400 });
    }

    // Input validation
    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    if (message.length > 10000) {
      return NextResponse.json(
        { error: 'Message too long. Maximum 10,000 characters.' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { 
          role: 'system', 
          content: prompt, 
        },
        { role: 'user', content: message }
      ],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}