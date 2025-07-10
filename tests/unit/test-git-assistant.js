#!/usr/bin/env node

// Simple test runner for Git Assistant
const { spawn } = require('child_process');
const readline = require('readline');

console.log('🧪 Testing Git Assistant in dry-run mode...\n');

// Start the assistant in dry-run mode
const assistant = spawn('node', ['scripts/git-assistant.js', '--dry-run'], {
  stdio: ['pipe', 'inherit', 'inherit']
});

// Create readline interface for commands
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Git Assistant is running in dry-run mode.');
console.log('Commands: [Q]uit, [C]heck status\n');

rl.on('line', (input) => {
  switch (input.toLowerCase()) {
    case 'q':
      console.log('Stopping Git Assistant...');
      assistant.kill('SIGTERM');
      rl.close();
      process.exit(0);
      break;
    case 'c':
      console.log('Sending check command...');
      assistant.stdin.write('c');
      break;
    default:
      console.log('Unknown command. Use Q to quit or C to check.');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  assistant.kill('SIGTERM');
  rl.close();
  process.exit(0);
});

assistant.on('close', (code) => {
  console.log(`Git Assistant exited with code ${code}`);
  rl.close();
  process.exit(code);
});