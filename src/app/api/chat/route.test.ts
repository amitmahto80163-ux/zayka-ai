import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import * as gemini from '@/lib/gemini';

vi.mock('@/lib/gemini', () => ({
  chatWithChef: vi.fn().mockResolvedValue('Hello from Chef!'),
}));

describe('Chat API Route', () => {
  it('should return 400 if message is empty', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should call chatWithChef and return 200 on valid input', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.response).toBe('Hello from Chef!');
  });
});
