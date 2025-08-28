import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './SideBar';

vi.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}));

describe('Sidebar', () => {
  it('renders menu labels', () => {
    render(<Sidebar activeTab={0} onSelect={() => {}} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Friend')).toBeInTheDocument();
  });
});


