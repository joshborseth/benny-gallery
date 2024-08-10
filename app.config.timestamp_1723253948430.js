// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import { resolve } from "path";
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
