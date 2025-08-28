import { renderHook } from '@testing-library/react';
import { useHomeFeed } from './useHomeFeed';
import { describe, expect, it } from 'vitest';

describe('useHomeFeed', () => {
  it('initializes without crashing', () => {
    const { result } = renderHook(() => useHomeFeed());
    expect(typeof result.current.loading).toBe('boolean');
  });
});


