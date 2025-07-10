#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🎬 Starting Git Assistant Demo (10 seconds)...\n');

// Start the assistant
const assistant = spawn('node', ['scripts/git-assistant.js', '--dry-run', '--verbose'], {
  stdio: 'inherit',
  env: { ...process.env, CI: 'true' } // This prevents interactive mode issues
});

// Run for 10 seconds then stop
setTimeout(() => {
  console.log('\n\n🛑 Demo complete! Stopping Git Assistant...');
  assistant.kill('SIGTERM');
}, 10000);

// Handle early termination
process.on('SIGINT', () => {
  assistant.kill('SIGTERM');
  process.exit(0);
});