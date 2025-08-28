import { splitContentAndHashtagsAndFriends, formatDate, extractHashtagsAndContent, isEqual } from './index';

describe('utils', () => {
  it('splitContentAndHashtagsAndFriends parses content, hashtags and friends', () => {
    const text = 'Hello @bob and @alice #greeting #hello world';
    const r = splitContentAndHashtagsAndFriends(text);
    expect(r.content).toBe('Hello and world');
    expect(r.hashtags).toEqual(['greeting', 'hello']);
    expect(r.friends).toEqual(['bob', 'alice']);
  });

  it('formatDate returns Just now for very recent', () => {
    const nowIso = new Date().toISOString();
    expect(formatDate(nowIso)).toBe('Just now');
  });

  it('extractHashtagsAndContent pulls hashtags out', () => {
    const { content, hashtags } = extractHashtagsAndContent('Post about #nextjs and #vitest');
    expect(content).toBe('Post about and');
    // normalize double spaces that can appear after removal in current implementation
    expect(content.replace(/\s+/g, ' ').trim()).toBe('Post about and');
    expect(hashtags).toEqual(['#nextjs', '#vitest']);
  });

  it('isEqual compares nested objects and arrays', () => {
    expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
    expect(isEqual({ a: [1, 2] }, { a: [2, 1] })).toBe(false);
  });
});


