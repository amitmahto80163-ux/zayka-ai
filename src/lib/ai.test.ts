import { describe, it, expect } from 'vitest';
import { parseJSONResponse } from './ai';

describe('parseJSONResponse', () => {
  it('should parse raw JSON', () => {
    const raw = `{"name": "test"}`;
    expect(parseJSONResponse(raw)).toEqual({ name: 'test' });
  });

  it('should strip markdown code blocks', () => {
    const raw = `Here is your json:\n\`\`\`json\n{"name": "test"}\n\`\`\`\nHope you like it!`;
    expect(parseJSONResponse(raw)).toEqual({ name: 'test' });
  });

  it('should throw on completely invalid json', () => {
    const raw = `I am an AI, I refuse to give you JSON.`;
    expect(() => parseJSONResponse(raw)).toThrowError();
  });
});
