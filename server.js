
const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const cors = require('cors');

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

// Home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
});

// Editor page route
app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

// Upload image route
app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();
    // Create a unique image name
    let imagename = date.getDate() + date.getTime() + file.name;
    // Define the upload path
    let uploadPath = path.join(__dirname, "public", "uploads", imagename);

    // Move the file to the uploads directory
    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ filePath: `uploads/${imagename}` });
    });
});

// Dashboard route
app.get("/admin", (req, res) => {
    res.sendFile(path.join(initial_path, "dashboard.html"));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(initial_path, "profile.html"));
});
 

// Blog page route
app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
});

app.get("/:blog/editor", (req, res) => { 
    res.sendFile(path.join(initial_path, "editor.html"));
});
// server.js
// 404 Route for undefined paths
app.use((req, res) => {
    res.status(404).json("404 - Not Found");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
