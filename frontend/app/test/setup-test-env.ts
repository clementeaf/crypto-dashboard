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
}));

// Mock para '~/root'
vi.mock('~/root', () => ({
  useTheme: vi.fn(() => ({ theme: 'light', setTheme: vi.fn() })),
})); 