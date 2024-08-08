import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    //  ssr: { external: ["drizzle-orm"] },
  },
  server: {
    preset: "aws-lambda-streaming",
  },
});
