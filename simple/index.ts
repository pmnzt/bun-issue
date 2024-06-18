import { join } from "path";
import { promises as fs } from "fs";

const server = Bun.serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/gen":
        return handleGenerateFile();
      case "/all":
        return handleListFiles();
      case "/healthz":
        return new Response("OK", { status: 200 });
      case "/":
        return handleRootPage();
      default:
        return new Response("Not Found", { status: 404 });
    }
  },
});

async function handleGenerateFile() {
  const dirPath = "./random";
  await fs.mkdir(dirPath, { recursive: true });
  const randomName = Math.random().toString(36).substring(2) + ".txt";
  const content = Math.random().toString(36);
  await fs.writeFile(join(dirPath, randomName), content);
  return new Response("File generated", { status: 200 });
}

async function handleListFiles() {
  const files = await fs.readdir("./random");
  return new Response(JSON.stringify(files), { status: 200 });
}

function handleRootPage() {
  const html = `<html>
<head><title>API Index</title></head>
<body>
<h1>API Endpoints</h1>
<ul>
  <li><a href="/gen">Generate File</a></li>
  <li><a href="/all">List Files</a></li>
  <li><a href="/healthz">Health Check</a></li>
</ul>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

console.log(`Server running at http://localhost:${server.port}`);