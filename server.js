const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const storagePath = path.join(__dirname, 'storage.json');

// ============ MIDDLEWARE ============
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============ ROUTES ============

// GET / - Serve main HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

// GET /api/messages - Get all messages
app.get('/api/messages', (req, res) => {
    try {
        let messages = [];
        
        if (fs.existsSync(storagePath)) {
            const fileData = fs.readFileSync(storagePath, 'utf8');
            if (fileData.trim()) {
                messages = JSON.parse(fileData);
            }
        }
        
        console.log(`📦 Returning ${messages.length} messages`);
        res.json(messages);
    } catch (error) {
        console.error('✗ Error reading messages:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/message - Add new message
app.post('/api/message', (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || message.trim() === '') {
            return res.status(400).json({ success: false, error: 'Empty message' });
        }
        
        console.log(`💬 Processing message: ${message}`);
        
        // Read existing messages
        let messages = [];
        if (fs.existsSync(storagePath)) {
            try {
                const fileData = fs.readFileSync(storagePath, 'utf8');
                if (fileData.trim()) {
                    messages = JSON.parse(fileData);
                }
            } catch (error) {
                console.error('✗ Error reading storage:', error.message);
                messages = [];
            }
        }
        
        // Add new message
        const messageData = {
            id: messages.length + 1,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        messages.push(messageData);
        
        // Write to file
        fs.writeFileSync(storagePath, JSON.stringify(messages, null, 2));
        console.log('✓ Message saved to storage.json');
        
        res.json({ 
            success: true, 
            message: 'Message saved!',
            data: messageData
        });
    } catch (error) {
        console.error('✗ Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/clear - Clear all messages
app.post('/api/clear', (req, res) => {
    try {
        fs.writeFileSync(storagePath, '[]');
        console.log('🗑️ Storage cleared');
        res.json({ success: true, message: 'Storage cleared' });
    } catch (error) {
        console.error('✗ Error clearing storage:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
    console.error('✗ Server error:', err);
    res.status(500).json({ error: err.message });
});

// ============ 404 ============
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// ============ START SERVER ============
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🚀 Express Server Running                ║
║   📌 http://localhost:${PORT}              
║   💾 Messages saved to: storage.json      ║
╚════════════════════════════════════════════╝
    `);
});


