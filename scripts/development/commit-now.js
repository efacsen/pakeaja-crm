#!/usr/bin/env node

// Quick manual commit tool
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Import our modules
const analyzer = require('./scripts/git-assistant/analyzer');
const messageGenerator = require('./scripts/git-assistant/message-generator');
const sensitiveDetector = require('./scripts/git-assistant/sensitive-detector');

async function execGit(args) {
  return new Promise((resolve, reject) => {
    const git = spawn('git', args, { cwd: process.cwd() });
    let stdout = '';
    let stderr = '';

    git.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    git.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    git.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr || stdout));
      }
    });
  });
}

async function getGitStatus() {
  try {
    const status = await execGit(['status', '--porcelain=v1']);
    return status.split('\n').filter(line => line.trim());
  } catch (error) {
    return [];
  }
}

async function getIgnorePatterns() {
  try {
    const content = await fs.readFile('.gitassistantignore', 'utf-8');
    return content.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  } catch {
    return [
      'node_modules/',
      'dist/',
      '.next/',
      'build/',
      'coverage/',
      '*.log',
      '.env*',
      '.DS_Store'
    ];
  }
}

async function main() {
  console.log('🚀 Manual Git Commit Tool\n');

  try {
    // Check git status
    console.log('📋 Checking git status...');
    const statusLines = await getGitStatus();
    
    if (statusLines.length === 0) {
      console.log('✅ No changes to commit');
      return;
    }

    console.log(`📝 Found ${statusLines.length} changed files`);

    // Analyze changes
    console.log('🔍 Analyzing changes...');
    const ignorePatterns = await getIgnorePatterns();
    const changes = await analyzer.analyzeChanges(statusLines, ignorePatterns);

    if (changes.files.length === 0) {
      console.log('✅ No significant changes to commit (all ignored)');
      return;
    }

    console.log(`📊 Analysis complete:`);
    console.log(`   - Files to commit: ${changes.files.length}`);
    console.log(`   - Change type: ${changes.primaryChange}`);
    console.log(`   - Modules affected: ${Array.from(changes.modules).join(', ') || 'none'}`);

    // Check for sensitive data
    console.log('\n🔐 Scanning for sensitive data...');
    const sensitiveFiles = await sensitiveDetector.scan(changes.files);

    if (sensitiveFiles.length > 0) {
      console.log('❌ Sensitive data detected:');
      sensitiveFiles.forEach(file => {
        console.log(`   - ${file.path}: ${file.reason}`);
      });
      console.log('\nAborting commit for safety.');
      return;
    }

    console.log('✅ No sensitive data found');

    // Generate commit message
    console.log('\n📝 Generating commit message...');
    const message = await messageGenerator.generate(changes);

    console.log('\n📋 Proposed commit message:');
    console.log(`\x1b[36m${message}\x1b[0m`);

    // Show files to be committed
    console.log('\n📁 Files to be committed:');
    changes.files.forEach(file => {
      console.log(`   ${file.status === 'new' ? '+' : file.status === 'modified' ? '~' : '-'} ${file.path}`);
    });

    // Stage and commit
    console.log('\n📦 Staging files...');
    for (const file of changes.files) {
      await execGit(['add', file.path]);
    }

    console.log('💾 Creating commit...');
    await execGit(['commit', '-m', message]);

    console.log('\n✅ Commit successful!');
    console.log('🔗 View your commit: git log -1 --oneline');

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}