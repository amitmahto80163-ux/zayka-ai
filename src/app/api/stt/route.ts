import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Free High-Accuracy Kitchen Speech-to-Text (Groq Whisper Large v3 Turbo)
 * Handles noisy kitchen environments (pressure cooker whistles, sizzling tadka, exhaust fan)
 * and bilingual Hinglish (Hindi + English) voice commands.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | Blob | null;
    const language = (formData.get('language') as string) || 'hi';

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio blob is required' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured for Whisper STT', fallback: true },
        { status: 503 }
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append('file', audioFile, 'kitchen-voice.webm');
    upstreamForm.append('model', 'whisper-large-v3-turbo');
    upstreamForm.append(
      'prompt',
      'Indian home cooking voice command in Hinglish, Hindi, or English. Terms: tadka, masala, namak, haldi, jeera, dhaniya, mirch, aanch, flame, gas, paneer, aloo, pyaaz, tamatar, step, next, repeat, kitna, pakana.'
    );
    upstreamForm.append('response_format', 'json');
    if (language === 'english') {
      upstreamForm.append('language', 'en');
    } else {
      upstreamForm.append('language', 'hi');
    }

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
      },
      body: upstreamForm,
      signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Whisper STT failed: ${errText}`, fallback: true },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      text: (data.text || '').trim(),
      model: 'whisper-large-v3-turbo',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'STT failed', fallback: true },
      { status: 500 }
    );
  }
}
