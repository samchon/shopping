import ttsc from "@ttsc/unplugin/vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";

function shoppingApiPlugin(): Plugin {
  return {
    name: "shopping-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith("/api/")) {
          next();
          return;
        }

        try {
          const module = (await server.ssrLoadModule("/src/server/http.ts")) as {
            serveApiRequest: (
              request: IncomingMessage,
              response: ServerResponse,
            ) => Promise<void>;
          };
          await module.serveApiRequest(request, response);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of [
    "VITE_SHOPPING_API_HOST",
    "VITE_SHOPPING_CHANNEL_CODE",
    "VITE_SHOPPING_API_SIMULATE",
    "SHOPPING_API_SIMULATE",
  ]) {
    process.env[key] ??= env[key];
  }

  return {
    plugins: [ttsc(), shoppingApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
    },
    server: {
      port: Number(process.env.PORT ?? "3000"),
      strictPort: true,
    },
    build: {
      outDir: "dist/client",
    },
  };
});
