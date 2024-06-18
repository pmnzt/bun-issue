const fs = require('fs');
const path = require('path');
const http = require('http');

// Create the ./random directory if it doesn't exist
const randomDirPath = path.join(__dirname, 'random');
if (!fs.existsSync(randomDirPath)) {
  fs.mkdirSync(randomDirPath);
}

// Create a random file in the ./random directory
function createRandomFile() {
  const filePath = path.join(randomDirPath, `random_file_${Date.now()}.txt`);
  const randomData = `This is a random file created at ${new Date().toISOString()}`;
  fs.writeFileSync(filePath, randomData);
  return filePath;
}

// List the files in the ./random directory
function listRandomFiles() {
  return fs.readdirSync(randomDirPath);
}

// Health check endpoint
function healthCheck(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('OK');
}

// Request handler
function requestHandler(req, res) {
  const { url, method } = req;

  // Root URL
  if (url === '/' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <html>
        <body>
          <h1>Simple Node.js App</h1>
          <ul>
            <li><a href="/random/create">Create Random File</a></li>
            <li><a href="/random/list">List Random Files</a></li>
            <li><a href="/health">Health Check</a></li>
          </ul>
        </body>
      </html>
    `);
  }
  // Create random file
  else if (url === '/random/create' && method === 'GET') {
    const filePath = createRandomFile();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Random file created at ${filePath}`);
  }
  // List random files
  else if (url === '/random/list' && method === 'GET') {
    const files = listRandomFiles();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Random files:\n${files.join('\n')}`);
  }
  // Health check
  else if (url === '/health' && method === 'GET') {
    healthCheck(req, res);
  }
  // 404 for everything else
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
  }
}

// Create the server
const server = http.createServer(requestHandler);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});