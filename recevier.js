const writer = require('./writer');

function receiveMessage(message) {
    if (!message || message.trim() === '') {
        console.error('Error: Empty message received');
        return false;
    }
    
    console.log('[RECEIVER] Message received:', message);
    return writer.writeMessage(message);
}

module.exports = { receiveMessage };
