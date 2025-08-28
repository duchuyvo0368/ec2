import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from './Container';

describe('Container', () => {
  it('renders sidebar and children', () => {
    render(
      <Container sidebar={<div>SB</div>}>
        <div>CH</div>
      </Container>
    );
    expect(screen.getByText('SB')).toBeInTheDocument();
    expect(screen.getByText('CH')).toBeInTheDocument();
  });
});


