import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveApiRequest } from "./http";

const clientRoot = fileURLToPath(new URL("../client/", import.meta.url));
const mimeTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function loadEnvironment() {
  for (const filename of [
    ".env",
    ".env.local",
    ".env.production",
    ".env.production.local",
  ]) {
    const filepath = path.resolve(process.cwd(), filename);
    if (!existsSync(filepath)) {
      continue;
    }
    for (const line of readFileSync(filepath, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match?.[1] || match[2] === undefined) {
        continue;
      }
      const raw = match[2].replace(/^(['"])(.*)\1$/, "$2");
      process.env[match[1]] ??= raw;
    }
  }
}

function resolveClientFile(pathname: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const relative = decoded.replace(/^\/+/, "");
  const candidate = path.resolve(clientRoot, relative || "index.html");
  const resolvedRoot = path.resolve(clientRoot);
  const rootPrefix = `${resolvedRoot}${path.sep}`;
  if (candidate !== resolvedRoot && !candidate.startsWith(rootPrefix)) {
    return null;
  }
  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }
  return path.resolve(clientRoot, "index.html");
}

loadEnvironment();
process.env.NODE_ENV ??= "production";

const server = createServer(async (request, response) => {
  try {
    const url = new URL(
      request.url ?? "/",
      `http://${request.headers.host ?? "127.0.0.1"}`,
    );
    if (url.pathname.startsWith("/api/")) {
      await serveApiRequest(request, response);
      return;
    }

    const filepath = resolveClientFile(url.pathname);
    if (!filepath) {
      response.writeHead(400).end("Bad request");
      return;
    }
    response.setHeader(
      "Content-Type",
      mimeTypes[path.extname(filepath).toLowerCase()] ?? "application/octet-stream",
    );
    if (path.basename(filepath) !== "index.html") {
      response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    createReadStream(filepath).pipe(response);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    response.end("Internal server error");
  }
});

const port = Number(process.env.PORT ?? "3000");
const host = process.env.HOST ?? "0.0.0.0";
server.listen(port, host, () => {
  console.log(`Shopping frontend listening on http://${host}:${port}`);
});
