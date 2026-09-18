import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': \Bearer \\,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy',
        instructions: 'You are Zayka AI, a friendly Indian chef. The user will show you their pan via video and talk to you. Give them highly enthusiastic, helpful cooking advice in Hinglish (a mix of Hindi and English). Keep responses short and punchy.',
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating session token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
