import http.server
import socketserver
import os
import random
import string

PORT = 8000

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.end_headers()
        elif self.path == '/gen':
            self.create_random_file()
        elif self.path == '/all':
            self.list_files()
        elif self.path == '/':
            self.send_html_page()
        else:
            self.send_error(404, "File not found")

    def create_random_file(self):
        # Create the 'random' directory if it doesn't exist
        random_dir = 'random'
        if not os.path.exists(random_dir):
            os.makedirs(random_dir)

        # Generate a random file name and content
        filename = ''.join(random.choices(string.ascii_letters + string.digits, k=10)) + '.txt'
        file_path = os.path.join(random_dir, filename)
        content = ''.join(random.choices(string.ascii_letters + string.digits, k=random.randint(10, 100)))

        # Write the content to the file
        with open(file_path, 'w') as f:
            f.write(content)

        self.send_response(200)
        self.send_header("Content-Disposition", f"attachment; filename={filename}")
        self.end_headers()
        with open(file_path, 'rb') as f:
            self.wfile.write(f.read())

    def list_files(self):
        random_dir = 'random'
        if not os.path.exists(random_dir):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'No files found')
            return

        file_list = os.listdir(random_dir)
        file_paths = [os.path.join(random_dir, f) for f in file_list]
        file_links = '\n'.join([f'<a href="/{p}">{p}</a>' for p in file_list])

        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(f'''
            <html>
                <body>
                    <h1>Files in 'random' directory</h1>
                    {file_links}
                </body>
            </html>
        '''.encode())

    def send_html_page(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(b'''
            <html>
                <body>
                    <h1>API Endpoints</h1>
                    <ul>
                        <li><a href="/health">GET /health</a></li>
                        <li><a href="/gen">GET /gen</a></li>
                        <li><a href="/all">GET /all</a></li>
                    </ul>
                </body>
            </html>
        ''')

with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()