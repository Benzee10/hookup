import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        host: '0.0.0.0',
        port: 5000,
        strictPort: true,
        hmr: {
          clientPort: 443
        }
      },
      preview: {
        host: '0.0.0.0',
        port: 5000,
        strictPort: true
      },
      resolve: {
        alias: {
          '@': '.',
        }
      }
    };
});
