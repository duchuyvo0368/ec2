import '@testing-library/jest-dom/vitest';

// Global mocks and polyfills for jsdom environment

// Mock Notification API
// Vitest provides globals; keep it lightweight and deterministic for tests
class MockNotification {
  static permission: NotificationPermission = 'granted';
  title: string;
  options?: NotificationOptions;
  constructor(title: string, options?: NotificationOptions) {
    this.title = title;
    this.options = options;
  }
  static async requestPermission(): Promise<NotificationPermission> {
    return 'granted';
  }
}

// @ts-expect-error override jsdom
global.Notification = MockNotification as unknown as typeof Notification;

// Mock IntersectionObserver (no auto-callback; tests can override if needed)
class MockIntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  constructor(
    _callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.root = (options && options.root) || null;
    this.rootMargin = (options && options.rootMargin) || '0px';
    this.thresholds = [options && options.threshold ? (Array.isArray(options.threshold) ? options.threshold[0] : options.threshold) : 0];
  }
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

// @ts-expect-error override jsdom
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Common module mocks
import React from 'react';
import { vi } from 'vitest';

// next/image to plain img for tests
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement('img', props),
}));

// next/link to anchor
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => React.createElement('a', { href, ...rest }, children),
}));

// Firebase utils used by Header/Notification
vi.mock('@/utils/firebase', () => ({
  __esModule: true,
  requestForToken: async () => null,
  onMessageListener: async () => Promise.reject(new Error('no-op')),
}));

// Mock MUI icons to lightweight components to avoid EMFILE from loading many icon files
vi.mock('@mui/icons-material', () => {
  const React = require('react');
  const createIcon = (name: string) => (props: any) => React.createElement('span', { 'data-icon': name, ...props });
  return new Proxy(
    {},
    {
      get: (_target, prop: string) => createIcon(prop),
    }
  );
});

// Mock lucide-react icons similarly
vi.mock('lucide-react', () => {
  const React = require('react');
  const createIcon = (name: string) => (props: any) => React.createElement('span', { 'data-lucide': name, ...props });
  return new Proxy(
    {},
    {
      get: (_target, prop: string) => createIcon(prop),
    }
  );
});

