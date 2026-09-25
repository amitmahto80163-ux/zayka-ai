import { NextResponse } from 'next/server';

// Simple in-memory rate limiting map
// Keys can be IP addresses or user IDs. Values: { count: number, resetTime: number }
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const limit = 5; // max 5 calls per minute
  const windowMs = 60 * 1000;

  let record = rateLimitMap.get(identifier);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (record.count >= limit) {
    return true;
  }
  
  record.count++;
  return false;
}

export async function GET(req: Request) {
  try {
    // 1. Get the Authorization Header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    // 2. Verify the Firebase Token via REST (since firebase-admin isn't installed)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.error('Missing NEXT_PUBLIC_FIREBASE_API_KEY');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
    const verifyRes = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const authData = await verifyRes.json();
    const uid = authData.users?.[0]?.localId;
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }

    // 3. Basic Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitIdentifier = `${uid}-${ip}`;
    
    if (isRateLimited(rateLimitIdentifier)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // 4. Generate OpenAI Realtime Token
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy',
        instructions: 'You are Zayka AI, a friendly Indian chef. The user will show you their pan via video and talk to you. Give them highly enthusiastic, helpful cooking advice in Hinglish (a mix of Hindi and English). Keep responses short and punchy.',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI Error:', err);
      return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating session token:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
