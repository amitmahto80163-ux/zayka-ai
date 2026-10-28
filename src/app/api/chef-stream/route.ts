import { NextRequest } from 'next/server';
import { chatWithChef } from '@/lib/gemini';
import { CHEF_PROFILES } from '@/data/chefs';
import { AppLanguage, ChefId } from '@/types';

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

    const safeChefId = (chefId in CHEF_PROFILES ? chefId : 'rohan') as ChefId;
    const chef = CHEF_PROFILES[safeChefId] || CHEF_PROFILES.rohan;
    const safeLang = (language || 'hinglish') as AppLanguage;

    const userText =
      mode === 'advice'
        ? `Current Cooking Step: "${stepInstruction || 'Cooking step in progress'}". User Question: "${question || message || 'Kya dhyan rakhu?'}" — Give a short, practical 1-2 sentence spoken cooking tip.`
        : String(message || question || 'Hello Chef!');

    const systemPrompt = `You are ${chef.name}, an Indian home-cooking AI Chef (${chef.personality}). Reply naturally and warmly in ${safeLang} in 2-3 concise sentences.${dishName ? ` Context dish: ${dishName}.` : ''}`;

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
                  { role: 'system', content: systemPrompt },
                  ...(Array.isArray(history)
                    ? history.slice(-6).map((h: { role?: string; content?: string }) => ({
                        role: h.role === 'user' ? 'user' : 'assistant',
                        content: String(h.content || ''),
                      }))
                    : []),
                  { role: 'user', content: userText },
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

          // Fallback: multi-provider chatWithChef streamed in smooth word chunks
          const fullReply = await chatWithChef(
            userText,
            safeChefId,
            safeLang,
            dishName ? ({ name: dishName } as any) : null,
            Array.isArray(history) ? history : []
          );
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
