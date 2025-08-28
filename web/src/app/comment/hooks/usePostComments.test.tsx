import { renderHook, act } from '@testing-library/react';
import { usePostComments } from './usePostComments';
import { describe, expect, it } from 'vitest';

const basePost = {
  id: 'p1',
  content: 'hello',
  images: [],
  videos: [],
  feel: {},
  hashtags: [],
  comments: [],
  privacy: 'public' as const,
  feelCount: {},
  views: 0,
  createdAt: new Date().toISOString(),
  post_link_meta: null,
  comment_count: 0,
};

const user = { _id: 'u1', name: 'User', avatar: 'a' };

describe('usePostComments', () => {
  it('adds a new comment optimistically', async () => {
    const { result } = renderHook(() => usePostComments(true, basePost, user));
    act(() => {
      result.current.setNewComment('Hi');
    });
    act(() => {
      result.current.handleCommentSubmit();
    });
    expect(result.current.comments.length).toBeGreaterThan(0);
    expect(result.current.newComment).toBe('');
  });
});


