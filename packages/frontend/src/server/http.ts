import type { IncomingMessage, ServerResponse } from "node:http";
import { handleApiRequest } from "./api";

async function readBody(request: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function toHeaders(request: IncomingMessage): Headers {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value !== undefined) {
      headers.set(name, value);
    }
  }
  return headers;
}

async function toFetchRequest(request: IncomingMessage): Promise<Request> {
  const forwardedProtocol = request.headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProtocol)
    ? forwardedProtocol[0]
    : forwardedProtocol?.split(",")[0];
  const origin = `${protocol?.trim() || "http"}://${request.headers.host ?? "127.0.0.1"}`;
  const url = new URL(request.url ?? "/", origin);
  const method = request.method?.toUpperCase() || "GET";
  const body = method === "GET" || method === "HEAD"
    ? null
    : await readBody(request);

  return new Request(url, {
    method,
    headers: toHeaders(request),
    ...(body?.length ? { body: new Uint8Array(body) } : {}),
  });
}

async function writeFetchResponse(
  response: ServerResponse,
  fetchResponse: Response,
): Promise<void> {
  response.statusCode = fetchResponse.status;
  response.statusMessage = fetchResponse.statusText;

  fetchResponse.headers.forEach((value, name) => {
    if (name !== "set-cookie") {
      response.setHeader(name, value);
    }
  });
  const headers = fetchResponse.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const cookies = headers.getSetCookie?.() ?? [];
  if (cookies.length) {
    response.setHeader("Set-Cookie", cookies);
  } else {
    const cookie = fetchResponse.headers.get("set-cookie");
    if (cookie) {
      response.setHeader("Set-Cookie", cookie);
    }
  }

  if (fetchResponse.body === null) {
    response.end();
    return;
  }
  response.end(Buffer.from(await fetchResponse.arrayBuffer()));
}

export async function serveApiRequest(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const fetchRequest = await toFetchRequest(request);
  await writeFetchResponse(response, await handleApiRequest(fetchRequest));
}
