const { receiveMessage } = require('./recevier');

console.log('=== Message Flow Test ===\n');

// Test 1: Send first message
console.log('Test 1: Sending first message...');
receiveMessage('Hello World');

console.log('\n---\n');

// Test 2: Send second message
console.log('Test 2: Sending second message...');
receiveMessage('This is a test message');

console.log('\n---\n');

// Test 3: Send third message
console.log('Test 3: Sending third message...');
receiveMessage('Messages are being stored in storage.json');

console.log('\n=== Done! Check storage.json ===');
