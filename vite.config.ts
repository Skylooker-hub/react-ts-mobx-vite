import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/

const commonConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      src: path.join(__dirname, "src"),
      apis: path.join(__dirname, "src/apis"),
      stores: path.join(__dirname, "src/stores"),
    },
  },
};

export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    return {
      // dev 独有配置
      ...commonConfig,
    };
  } else {
    // command === 'build'
    return {
      // build 独有配置
      ...commonConfig,
    };
  }
});
