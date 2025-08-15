import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig(({ mode }) => {
  const envFilename =
    mode === 'production'
      ? 'environment.prod.ts'
      : mode === 'staging'
        ? 'environment.staging.ts'
        : 'environment.ts';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // alias esistenti
        '@public': path.resolve(__dirname, 'public'),
        '@assets': path.resolve(__dirname, 'public/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@shared': path.resolve(__dirname, 'src/components/shared'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@core_admin': path.resolve(__dirname, 'src/admin/core'),
        '@store_admin': path.resolve(__dirname, 'src/admin/core/store'),
        '@sections_admin': path.resolve(__dirname, 'src/admin/sections'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@env': path.resolve(__dirname, 'src/environments', envFilename),
      },
    },
  };
});
