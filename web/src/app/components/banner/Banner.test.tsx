import React from 'react';
import { render } from '@testing-library/react';
import Banner from './Banner';

describe('Banner', () => {
  it('renders without crashing', () => {
    render(<Banner />);
  });
});


