
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350
    },
    {
        id: 2,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 400
    }
];

const server = http.createServer((req, res) => {

    // Route 1: Home
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end('<h1>Welcome to Library Management System</h1>');
    }

    // Route 2: Get all books
    else if (req.method === 'GET' && req.url === '/books') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(books));
    }

    // Route 3: About
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end('<h2>Library Management Application using Node.js</h2>');
    }

    // Route 4: Serve HTML using FS module
    else if (req.method === 'GET' && req.url === '/home') {
        const filePath = path.join(__dirname, 'public', 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Error reading HTML file');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(data);
            }
        });
    }

    // Route 5: Add book using POST
    else if (req.method === 'POST' && req.url === '/add-book') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const book = JSON.parse(body);

                if (
                    book.id === undefined ||
                    !book.title ||
                    !book.author ||
                    book.price === undefined ||
                    book.price === null ||
                    book.title.trim() === '' ||
                    book.author.trim() === ''
                ) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: 'All book details are required'
                    }));
                    return;
                }

                if (books.some(b => b.id === book.id)) {
                    res.writeHead(409, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: 'Book ID already exists'
                    }));
                    return;
                }

                books.push(book);

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: 'Book added successfully',
                    book
                }));

            } catch (error) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: 'Invalid JSON data'
                }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('404 - Page Not Found');
    }

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
