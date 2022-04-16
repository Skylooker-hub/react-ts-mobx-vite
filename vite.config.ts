import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/

const commonConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.join(__dirname, 'src'),
      apis: path.join(__dirname, 'src/apis'),
      stores: path.join(__dirname, 'src/stores'),
    },
  },
  build: {
    target: ['chrome58', 'firefox57', 'safari11', 'edge16', 'node12'],
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    const devConfig: UserConfig = {
      // dev 独有配置
    };
    return Object.assign(commonConfig, devConfig);
  } else {
    // command === 'build'
    const buildConfig: UserConfig = {
      // dev 独有配置
      plugins: [
        legacy({
          targets: ['ie >= 11'],
          additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        }),
      ],
    };
    return Object.assign(commonConfig, buildConfig);
  }
});
