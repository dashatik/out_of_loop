import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message, apiKey, model } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 401 });
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { 
          role: 'system', 
          content: `Act as an expert across all domains (e.g., finance, technology, health, education, science, philosophy, art, etc.) and subtopics (e.g., budgeting, Python programming, mental health, teaching strategies, quantum mechanics, art history, etc.). Respond concisely or in-depth based on the context, using a professional yet approachable tone. Provide your answer with:
          
          1. A **clear and direct response** to the question or request.
          2. **Contextual details** for better understanding, with examples where helpful.
          3. **Actionable insights or next steps** (if applicable).
          4. Markdown formatting for clarity, such as:
             - **Headings** for organization.
             - **Lists** for structured points.
             - **Code snippets** for technical answers.
             - **Tables** for comparison or data visualization.
             - **Bold or italic emphasis** to highlight key points.
    
          Ensure the response is:
          - **Comprehensive** without being overly verbose.
          - **Adaptable** to both novice and expert-level readers.
          - **Formatted** for readability and engagement.
    
          Here's the question or task:` 
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