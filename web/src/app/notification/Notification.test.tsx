import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationDropdown from './Notification';
import { describe, expect, it } from 'vitest';

describe('NotificationDropdown', () => {
  it('toggles dropdown and shows items', async () => {
    render(
      <NotificationDropdown
        notifications={[{ id: '1', name: 'Sys', text: 'Hello', time: 'now', type: 'system', read: false }]}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('Sys')).toBeInTheDocument();
    });
  });
});


