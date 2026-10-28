import { NextRequest } from 'next/server';
import { getChefChatPrompt, getCookingAdvicePrompt } from '@/lib/gemini';
import { callFastAI } from '@/lib/providers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mode = 'chat',
      message,
      question,
      stepInstruction,
      dishName,
      chefId = 'rohan',
      language = 'hinglish',
      history = [],
    } = body;

    const prompt =
      mode === 'advice'
        ? getCookingAdvicePrompt(
            stepInstruction || 'Cooking current step',
            question || message || 'Kya dhyan rakhu?',
            chefId,
            language
          )
        : getChefChatPrompt(
            message || question || 'Hello Chef!',
            dishName || 'Indian Home Cooking',
            chefId,
            language,
            Array.isArray(history) ? history : []
          );

    const encoder = new TextEncoder();
    const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (payload: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        };

        try {
          if (groqKey) {
            const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${groqKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                stream: true,
                temperature: 0.7,
                max_tokens: 450,
                messages: [
                  {
                    role: 'system',
                    content:
                      'You are an warm, expert Indian home-cooking Chef from Zayka AI. Reply concisely and naturally in the requested language.',
                  },
                  { role: 'user', content: prompt },
                ],
              }),
              signal: AbortSignal.timeout(12000),
            });

            if (upstream.ok && upstream.body) {
              const reader = upstream.body.getReader();
              const decoder = new TextDecoder();
              let buffer = '';

              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed.startsWith('data:')) continue;
                  const dataStr = trimmed.replace(/^data:\s*/, '');
                  if (dataStr === '[DONE]') continue;
                  try {
                    const parsed = JSON.parse(dataStr);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) {
                      sendEvent({ delta });
                    }
                  } catch {
                    // Ignore partial JSON chunk
                  }
                }
              }

              sendEvent({ done: true });
              controller.close();
              return;
            }
          }

          // Fallback: multi-provider fast AI chunked stream
          const fullReply = await callFastAI(prompt);
          const words = (fullReply || '').split(/(\s+)/);
          for (let i = 0; i < words.length; i += 3) {
            const chunk = words.slice(i, i + 3).join('');
            if (chunk) {
              sendEvent({ delta: chunk });
            }
          }
          sendEvent({ done: true });
          controller.close();
        } catch (err) {
          sendEvent({
            error: err instanceof Error ? err.message : 'Streaming failed',
            done: true,
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 400 }
    );
  }
}
