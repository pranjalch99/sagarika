import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".txt": "text/plain; charset=utf-8",
};

createServer((request, response) => {
  const rawPath = decodeURIComponent((request.url ?? "/").split("?")[0]);
  const cleanPath = rawPath === "/" ? "/index.html" : rawPath;
  let filePath = join(root, cleanPath);

  if (!filePath.startsWith(root) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(root, `${cleanPath.replace(/\/$/, "")}.html`);
  }

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    filePath = join(root, "404.html");
  }

  response.writeHead(filePath.endsWith("404.html") ? 404 : 200, {
    "Content-Type": types[extname(filePath)] ?? "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Preview running at http://127.0.0.1:${port}`);
});
