import React from 'react';
import { render } from '@testing-library/react';
import InfiniteScroll from './IfiniteScroll';
import { describe, expect, it } from 'vitest';

describe('InfiniteScroll', () => {
  it('renders children', () => {
    const { getByText } = render(
      <InfiniteScroll fetchMore={() => {}} hasMore={false}>
        <div>Child Content</div>
      </InfiniteScroll>
    );
    expect(getByText('Child Content')).toBeInTheDocument();
  });
});


