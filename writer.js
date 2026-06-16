const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, 'storage.json');

function writeMessage(message) {
    try {
        console.log('[WRITER] Writing message:', message);
        
        // Read existing messages
        let messages = [];
        if (fs.existsSync(storagePath)) {
            try {
                const data = fs.readFileSync(storagePath, 'utf8');
                messages = JSON.parse(data);
            } catch (error) {
                console.error('[WRITER] Error reading storage:', error.message);
                messages = [];
            }
        }
        
        // Add new message with timestamp
        const messageData = {
            id: messages.length + 1,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        messages.push(messageData);
        
        // Write to storage.json file
        fs.writeFileSync(storagePath, JSON.stringify(messages, null, 2));
        
        console.log('[WRITER] Message saved to storage.json');
        console.log('[WRITER] Total messages:', messages.length);
        
        return true;
    } catch (error) {
        console.error('[WRITER] Error writing to storage:', error.message);
        return false;
    }
}

module.exports = { writeMessage };