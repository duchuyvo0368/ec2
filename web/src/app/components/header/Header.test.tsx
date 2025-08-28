import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Login button when user is not logged in', () => {
    render(<Header />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders user name when user is logged in', () => {
    localStorage.setItem('userInfo', JSON.stringify({ _id: 'u1', name: 'Alice', avatar: '' }));
    render(<Header />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});


