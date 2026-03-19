const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-Memory DB for Stored XSS
let comments = [
    { author: "Admin", text: "Welcome to the training forum. Please leave a comment below!" }
];

app.get('/', (req, res) => {
    // Basic Reflected XSS Endpoint
    let search_query = req.query.q || '';
    
    // HTML Template
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Vulnerable Forum</title>
        <style>
            body { font-family: sans-serif; padding: 20px; background: #f0f2f5; }
            .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .comment { border-bottom: 1px solid #eee; padding: 10px 0; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>Search the Forum (Reflected XSS)</h2>
            <form method="GET" action="/">
                <input type="text" name="q" placeholder="Search..." value="">
                <button type="submit">Search</button>
            </form>
            <p>Search Results for: ${search_query}</p> <!-- VULNERABLE TO REFLECTED XSS -->
        </div>

        <div class="card">
            <h2>Discussion Board (Stored XSS)</h2>
            <div id="comments">
                ${comments.map(c => `<div class="comment"><strong>${c.author}:</strong> ${c.text}</div>`).join('')} <!-- VULNERABLE TO STORED XSS -->
            </div>
            
            <hr style="margin:20px 0;">
            <h3>Leave a Comment</h3>
            <form method="POST" action="/comment">
                <input type="text" name="author" placeholder="Your Name" required><br><br>
                <textarea name="text" placeholder="Your Comment" rows="4" cols="50" required></textarea><br><br>
                <button type="submit">Post Comment</button>
            </form>
        </div>
    </body>
    </html>
    `;
    
    res.send(html);
});

app.post('/comment', (req, res) => {
    const { author, text } = req.body;
    if(author && text) {
        comments.push({ author, text });
    }
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Vulnerable XSS App listening at http://localhost:${port}`);
});
