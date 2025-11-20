const express = require('express');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Explicit CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Health check endpoint
app.get('/ping', (req, res) => {
    console.log('Ping received');
    res.send('pong');
});

// Request Logger Middleware (Moved before body parser)
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} - Received`);
    next();
});

app.use(express.json());

// Log body after parsing
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} - Body parsed:`, req.body);
    next();
});

// Initialize Database Schema
const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await db.query(schemaSql);
        console.log('Database schema initialized');
    } catch (err) {
        console.error('Error initializing database schema:', err);
    }
};

// --- Projects API ---

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create project
app.post('/api/projects', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO projects (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Prompts API ---

// Get all prompts
app.get('/api/prompts', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT id, title, content, tags, project_id as "projectId", created_at 
      FROM prompts 
      ORDER BY created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create prompt
app.post('/api/prompts', async (req, res) => {
    const { title, content, tags, projectId } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO prompts (title, content, tags, project_id) VALUES ($1, $2, $3, $4) RETURNING id, title, content, tags, project_id as "projectId", created_at',
            [title, content, tags, projectId || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update prompt
app.put('/api/prompts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, tags, projectId } = req.body;
    try {
        const result = await db.query(
            'UPDATE prompts SET title = $1, content = $2, tags = $3, project_id = $4 WHERE id = $5 RETURNING id, title, content, tags, project_id as "projectId", created_at',
            [title, content, tags, projectId || null, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prompt not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete prompt
app.delete('/api/prompts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM prompts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prompt not found' });
        }
        res.json({ message: 'Prompt deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (bound to 0.0.0.0)`);
    initDb();
});

// Keep process alive (Required for some environments where app.listen doesn't hold the loop)
setInterval(() => { }, 1 << 30);

// Debugging: Log why the process might be exiting
process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
