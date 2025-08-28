import { render } from '@testing-library/react';
import HomeIndex from './page';

describe('app/page', () => {
  it('renders without crashing', () => {
    render(<HomeIndex />);
  });
});


