import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message, apiKey, model, prompt } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 401 });
    }

    if (!prompt) {
      console.warn("Prompt is missing. Ensure the frontend sends the correct data.");
      return NextResponse.json({ error: "Prompt not provided" }, { status: 400 });
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