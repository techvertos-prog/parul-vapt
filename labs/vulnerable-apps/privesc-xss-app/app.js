const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3001; // Runs on 3001 to not conflict with the other XSS lab

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mock Database
let posts = [
    { id: 1, author: 'Admin', content: 'Welcome to the internal team forum.' }
];

let users = [
    { username: 'admin', password: 'admin_password', role: 'admin' },
    { username: 'john', password: 'password123', role: 'user' }
];

// Helper to get current user from simple insecure cookie
function getUser(req) {
    if (req.cookies.session) {
        return users.find(u => u.username === req.cookies.session);
    }
    return null;
}

app.get('/', (req, res) => {
    const user = getUser(req);
    
    let html = `
    <html>
    <head><title>Internal Corporate Forum</title>
    <style>
        body { font-family: sans-serif; margin: 40px; background: #f8fafc;}
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); margin-bottom: 20px;}
        .post { border-left: 4px solid #3b82f6; padding-left: 15px; margin-top: 15px; background: #f1f5f9; padding: 10px;}
        .admin-panel { border: 2px solid #ef4444; padding: 15px; margin-top: 20px; background: #fee2e2;}
    </style>
    </head>
    <body>
        <div class="card">
            <h2>Welcome to the Team Forum</h2>
            <p>Current User: <strong>${user ? user.username : 'Guest'}</strong> | Role: <span style="color:red">${user ? user.role : 'None'}</span></p>
    `;

    if (!user) {
        html += `
            <hr><h3>Login</h3>
            <form action="/login" method="POST">
                Username: <input type="text" name="username"><br><br>
                Password: <input type="password" name="password"><br><br>
                <button type="submit">Login</button>
            </form>
        `;
    } else {
        html += `<a href="/logout">Logout</a><hr>`;
        
        if (user.role === 'admin') {
            html += `
            <div class="admin-panel">
                <h3>👑 Admin Danger Zone</h3>
                <form action="/admin/add_user" method="POST">
                    New Username: <input type="text" name="new_username"><br><br>
                    New Password: <input type="password" name="new_password"><br><br>
                    <button type="submit" style="background: red; color: white;">Force Create Admin User</button>
                </form>
            </div>
            `;
        }

        html += `
            <h3>Forum Posts</h3>
            <div id="posts">
                ${posts.map(p => `<div class="post"><strong>${p.author}</strong> wrote:<br>${p.content}</div>`).join('')}
            </div>
            
            <hr>
            <h3>Leave a message</h3>
            <form action="/post" method="POST">
                <textarea name="content" rows="4" cols="50"></textarea><br>
                <button type="submit">Submit Post</button>
            </form>
        `;
    }
    
    html += `</div></body></html>`;
    res.send(html);
});

// VULNERABLE LOGIN
app.post('/login', (req, res) => {
    const user = users.find(u => u.username === req.body.username && u.password === req.body.password);
    if (user) {
        res.cookie('session', user.username);
        res.redirect('/');
    } else {
        res.send('Invalid login <a href="/">Go back</a>');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

// VULNERABLE STORED XSS (No sanitization)
app.post('/post', (req, res) => {
    const user = getUser(req);
    if (!user) return res.send("Must be logged in.");
    
    posts.push({
        id: posts.length + 1,
        author: user.username,
        content: req.body.content // Vulnerability: Untrusted input directly saved
    });
    res.redirect('/');
});

// FORGED ADMIN ENDPOINT (CSRF Vulnerable)
app.post('/admin/add_user', (req, res) => {
    const user = getUser(req);
    // VULNERABILITY: No Anti-CSRF token check, just relies on the session cookie
    if (!user || user.role !== 'admin') {
        return res.status(403).send("Forbidden. You are not an admin.");
    }
    
    users.push({
        username: req.body.new_username,
        password: req.body.new_password,
        role: 'admin' // Forces new user to be an admin
    });
    
    res.send(`Successfully created new Admin account: ${req.body.new_username}. <a href="/">Go back</a>`);
});

app.listen(port, () => {
  console.log(`PrivEsc XSS Lab app listening at http://localhost:${port}`)
});
