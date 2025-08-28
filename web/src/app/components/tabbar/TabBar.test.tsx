import React from 'react';
import { render, screen } from '@testing-library/react';
import TabBar from './TabBar';

describe('Friends TabBar', () => {
  it('renders title', () => {
    render(<TabBar activeTab={0} onSelect={() => {}} />);
    expect(screen.getByText('Friends')).toBeInTheDocument();
  });
});


