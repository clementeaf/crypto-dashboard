import '@testing-library/jest-dom';

// Extiende los matchers para testing
declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveAttribute(name: string, value?: string): void;
    }
  }
} 