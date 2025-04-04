import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Limpiar DOM después de cada prueba
afterEach(() => {
  cleanup();
});

// Mock para la API de Remix
vi.mock('@remix-run/react', () => ({
  useNavigation: vi.fn(() => ({ state: 'idle' })),
  useLoaderData: vi.fn(() => ({})),
  Link: vi.fn(({ to, children, ...rest }: { to: string; children: React.ReactNode; [key: string]: any }) => 
    React.createElement('a', { href: to, ...rest }, children)
  ),
  Outlet: vi.fn(() => null),
  useActionData: vi.fn(() => null),
  Form: vi.fn(({ children, ...rest }: { children: React.ReactNode; [key: string]: any }) => 
    React.createElement('form', { ...rest }, children)
  ),
  Meta: vi.fn(() => null),
  Links: vi.fn(() => null),
  Scripts: vi.fn(() => null),
  LiveReload: vi.fn(() => null),
  ScrollRestoration: vi.fn(() => null),
  json: vi.fn(data => data),
}));

// Mock para módulos que no necesitamos probar
vi.mock('~/root', () => ({
  useTheme: vi.fn(() => ({ theme: 'light', setTheme: vi.fn() })),
}));

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock para IntersectionObserver
global.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  
  constructor(private callback: IntersectionObserverCallback) {}
  
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}; 