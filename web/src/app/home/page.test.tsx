import React from 'react';
import { render, screen } from '@testing-library/react';
import * as hookModule from './hooks/useHomePage';
import HomePage from './page';
import { describe, expect, vi } from 'vitest';

vi.mock('./hooks/useHomePage');

// Mock child components that may be heavy
vi.mock('@/app/components/header/Header', () => ({ default: () => <div>Header</div> }));
vi.mock('@/app/components/sidebar/SideBar', () => ({ default: () => <div>Sidebar</div> }));
vi.mock('./components/home/TabBar', () => ({ default: () => <div>TabBar</div> }));
vi.mock('./components/home/Home', () => ({ default: () => <div>HomeFeed</div> }));
vi.mock('@/app/home/components/rightsidebar/RightSidebar', () => ({ default: () => <div>RightSidebar</div> }));

describe('Home page', () => {
  it('renders expected layout', () => {
    (hookModule as any).useHomePage.mockReturnValue({ actionSideBar: 0, setActiveSideBar: vi.fn() });
    render(<HomePage />);
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('TabBar')).toBeInTheDocument();
    expect(screen.getByText('HomeFeed')).toBeInTheDocument();
  });
});


