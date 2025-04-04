import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vitePlugin as remix } from "@remix-run/dev";
import react from "@vitejs/plugin-react";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(({ mode }) => {
  if (mode === 'test') {
    // Configuración específica para pruebas
    return {
      plugins: [react(), tsconfigPaths()],
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./app/test/setup-test-env.ts'],
        include: ['./app/**/*.test.{ts,tsx}'],
        exclude: ['./app/routes/**'],
        css: false,
      },
    };
  }

  // Configuración para desarrollo y producción
  return {
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      react(),
      tsconfigPaths(),
    ],
  };
});
