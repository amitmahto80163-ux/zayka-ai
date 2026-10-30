import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function normalizeCulinarySpeech(raw: string): string {
  return raw
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[*_#`~[\]()]/g, '')
    .replace(/\btbsp\b/gi, 'tablespoon')
    .replace(/\btsp\b/gi, 'teaspoon')
    .replace(/\bmin\b/gi, 'minute')
    .replace(/\bsec\b/gi, 'second')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = (searchParams.get('text') || '').trim();
    const lang = (searchParams.get('lang') || 'hi').trim();
    const chefId = (searchParams.get('chef') || 'rohan').trim();

    if (!text) {
      return new NextResponse('Text is required', { status: 400 });
    }

    const cleanText = normalizeCulinarySpeech(text);
    const tl = lang === 'english' ? 'en-IN' : 'hi';
    const ttsspeed = chefId === 'savita' ? '0.9' : '1';
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText || text.slice(0, 100)
    )}&tl=${tl}&ttsspeed=${ttsspeed}&client=tw-ob`;

    const res = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      return new NextResponse('TTS service unavailable', { status: res.status });
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err: any) {
    console.error('TTS error:', err);
    return new NextResponse(err?.message || 'Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = (body.text || '').trim();
    const lang = (body.lang || 'hi').trim();
    const chefId = (body.chef || 'rohan').trim();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const cleanText = normalizeCulinarySpeech(text);
    const tl = lang === 'english' ? 'en-IN' : 'hi';
    const ttsspeed = chefId === 'savita' ? '0.9' : '1';
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText || text.slice(0, 100)
    )}&tl=${tl}&ttsspeed=${ttsspeed}&client=tw-ob`;

    const res = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'TTS service unavailable' }, { status: 502 });
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
