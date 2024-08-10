// app.config.ts
import { defineConfig } from "@solidjs/start/config";
var app_config_default = defineConfig({
  vite: {
    ssr: { external: ["drizzle-orm"] },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src")
      }
    }
  },
  server: {
    preset: "aws-lambda-streaming"
  }
});
export {
  app_config_default as default
};
