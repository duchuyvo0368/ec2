import { renderHook, act } from '@testing-library/react';
import { useCreatePost } from './useCreatePost';
import { describe, expect, it } from 'vitest';

describe('useCreatePost', () => {
  it('initializes default state', () => {
    const onClose = () => {};
    const onPostCreated = () => {};
    const userInfo: any = { _id: 'u1' };
    const { result } = renderHook(() => useCreatePost(onClose, userInfo, onPostCreated));
    expect(result.current.postContent).toBe('');
    expect(result.current.privacy).toBe('public');
  });
});


