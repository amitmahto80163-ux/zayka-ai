import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/gemini', () => ({
  generateRecipe: vi.fn().mockResolvedValue({ name: 'Test Recipe' }),
  adaptRecipeToIngredients: vi.fn(),
}));

describe('Recipe API Route', () => {
  it('should return 400 if dishName is missing', async () => {
    const req = new NextRequest('http://localhost/api/recipe', {
      method: 'POST',
      body: JSON.stringify({ servings: 2 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should call generateRecipe and return 200 on valid input', async () => {
    const req = new NextRequest('http://localhost/api/recipe', {
      method: 'POST',
      body: JSON.stringify({ dishName: 'Paneer Tikka' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Test Recipe');
  });
});
