#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Import helper modules
const analyzer = require('./git-assistant/analyzer');
const messageGenerator = require('./git-assistant/message-generator');
const sensitiveDetector = require('./git-assistant/sensitive-detector');
const branchManager = require('./git-assistant/branch-manager');
const sessionTracker = require('./git-assistant/session-tracker');
const prGenerator = require('./git-assistant/pr-generator');

// Configuration
const CONFIG = {
  checkInterval: 30 * 60 * 1000, // 30 minutes
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
  pauseFile: path.join(__dirname, '.git-assistant-pause'),
  stateFile: path.join(process.cwd(), '.claude', 'current-state.md'),
  logFile: path.join(process.cwd(), '.claude', 'git-assistant.log'),
  ignoreFile: path.join(process.cwd(), '.gitassistantignore'),
  maxFileSize: 10 * 1024 * 1024, // 10MB
  colors: {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  }
};

// State management
let state = {
  isPaused: false,
  nextCheckTime: null,
  sessionStart: Date.now(),
  commitsThisSession: 0,
  changesTracked: 0,
  lastCommitTime: null
};

// Utility functions
function log(message, color = 'white') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${CONFIG.colors[color]}[${timestamp}] ${message}${CONFIG.colors.reset}`);
}

function logVerbose(message) {
  if (CONFIG.verbose) {
    log(message, 'dim');
  }
}

async function writeLog(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}\n`;
  await fs.appendFile(CONFIG.logFile, logEntry).catch(() => {});
}

function formatTime(ms) {
  if (ms < 0) ms = 0; // Handle negative values
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

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
    const content = await fs.readFile(CONFIG.ignoreFile, 'utf-8');
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

async function checkForChanges() {
  log('🔍 Checking for changes...', 'cyan');
  
  try {
    const statusLines = await getGitStatus();
    if (statusLines.length === 0) {
      log('✅ No changes detected', 'green');
      return null;
    }

    const ignorePatterns = await getIgnorePatterns();
    const changes = await analyzer.analyzeChanges(statusLines, ignorePatterns);
    
    if (changes.files.length === 0) {
      log('✅ No significant changes to commit', 'green');
      return null;
    }

    state.changesTracked = changes.files.length;
    log(`📝 Found ${changes.files.length} changed files`, 'yellow');
    
    // Check for sensitive data
    log('🔐 Scanning for sensitive data...', 'cyan');
    const sensitiveFiles = await sensitiveDetector.scan(changes.files);
    
    if (sensitiveFiles.length > 0) {
      log('⚠️  Sensitive data detected:', 'red');
      sensitiveFiles.forEach(file => {
        log(`   - ${file.path}: ${file.reason}`, 'red');
      });
      
      if (!CONFIG.dryRun) {
        await writeLog(`Skipped commit due to sensitive data in: ${sensitiveFiles.map(f => f.path).join(', ')}`);
      }
      return null;
    }

    return changes;
  } catch (error) {
    log(`❌ Error checking changes: ${error.message}`, 'red');
    return null;
  }
}

async function performCommit(changes) {
  try {
    // Generate commit message
    const message = await messageGenerator.generate(changes);
    
    log('📋 Commit message:', 'cyan');
    console.log(`   ${CONFIG.colors.bright}${message}${CONFIG.colors.reset}`);
    
    if (CONFIG.dryRun) {
      log('🏃 Dry run mode - skipping actual commit', 'yellow');
      return;
    }

    // Stage files
    log('📦 Staging files...', 'cyan');
    for (const file of changes.files) {
      await execGit(['add', file.path]);
    }

    // Commit
    await execGit(['commit', '-m', message]);
    
    state.commitsThisSession++;
    state.lastCommitTime = Date.now();
    
    log('✅ Commit successful!', 'green');
    await writeLog(`Committed: ${message}`);
    
    // Update state file
    await updateStateFile(changes, message);
    
    // Check if we should create a feature branch
    if (changes.isNewFeature) {
      const shouldBranch = await promptUser('Create a feature branch for these changes? (y/n): ');
      if (shouldBranch.toLowerCase() === 'y') {
        const branchName = await branchManager.createFeatureBranch(changes.featureName);
        log(`🌿 Created branch: ${branchName}`, 'green');
      }
    }
    
  } catch (error) {
    log(`❌ Commit failed: ${error.message}`, 'red');
    await writeLog(`Commit failed: ${error.message}`);
  }
}

async function updateStateFile(changes, commitMessage) {
  const stateContent = `# Git Assistant State
Last Updated: ${new Date().toLocaleString()}

## Current Session
- Started: ${new Date(state.sessionStart).toLocaleString()}
- Commits: ${state.commitsThisSession}
- Last Commit: ${state.lastCommitTime ? new Date(state.lastCommitTime).toLocaleString() : 'None'}

## Recent Changes
${commitMessage}

### Files Changed
${changes.files.map(f => `- ${f.path} (${f.status})`).join('\n')}

## Work Summary
${await sessionTracker.getSummary()}

## Next Steps
- Continue monitoring for changes
- Next check at: ${new Date(state.nextCheckTime).toLocaleTimeString()}
`;

  await fs.writeFile(CONFIG.stateFile, stateContent);
}

async function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function showStatus() {
  const now = Date.now();
  const timeToNext = state.nextCheckTime - now;
  const sessionDuration = now - state.sessionStart;
  
  console.clear();
  log('🤖 Git Assistant Active', 'bright');
  log(`⏰ Next auto-commit in: ${formatTime(timeToNext)}`, 'cyan');
  log(`📝 Tracking changes in: ${process.cwd()}`, 'blue');
  log(`🔍 Changed files: ${state.changesTracked}`, 'yellow');
  log(`✅ Commits this session: ${state.commitsThisSession}`, 'green');
  log(`⏱️  Session duration: ${formatTime(sessionDuration)}`, 'magenta');
  
  if (state.isPaused) {
    log('⏸️  PAUSED - Press R to resume', 'yellow');
  }
  
  if (CONFIG.dryRun) {
    log('🏃 DRY RUN MODE', 'yellow');
  }
  
  console.log('\nCommands:');
  console.log('  [P] Pause/Resume   [C] Commit now   [S] Status   [Q] Quit');
}

async function handleKeypress() {
  // Check if we're in a TTY environment
  if (!process.stdin.isTTY) {
    log('⚠️  Running in non-interactive mode (no keyboard controls)', 'yellow');
    return;
  }
  
  try {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', async (key) => {
      switch (key.toLowerCase()) {
        case 'p':
          state.isPaused = !state.isPaused;
          log(state.isPaused ? '⏸️  Paused' : '▶️  Resumed', 'yellow');
          break;
          
        case 'c':
          if (!state.isPaused) {
            log('⚡ Manual commit triggered', 'cyan');
            const changes = await checkForChanges();
            if (changes) {
              await performCommit(changes);
            }
          }
          break;
          
        case 's':
          showStatus();
          break;
          
        case 'q':
        case '\x03': // Ctrl+C
          await cleanup();
          process.exit(0);
          
        default:
          // Ignore other keys
      }
    });
  } catch (error) {
    log('⚠️  Could not enable interactive mode', 'yellow');
  }
}

async function cleanup() {
  log('👋 Shutting down Git Assistant...', 'yellow');
  await sessionTracker.endSession();
  
  const summary = await sessionTracker.getSessionSummary();
  log('📊 Session Summary:', 'cyan');
  log(`   Duration: ${summary.duration}`, 'white');
  log(`   Commits: ${summary.commits}`, 'white');
  log(`   Files changed: ${summary.filesChanged}`, 'white');
}

async function runCheck() {
  if (state.isPaused) {
    return;
  }
  
  const changes = await checkForChanges();
  if (changes) {
    // For large changes, prompt for confirmation
    if (changes.files.length > 10) {
      log(`⚠️  Large change detected (${changes.files.length} files)`, 'yellow');
      
      // In non-interactive mode, skip large commits by default
      if (!process.stdin.isTTY) {
        log('⏭️  Skipping large auto-commit in non-interactive mode', 'yellow');
        log('   Run in interactive mode to confirm large commits', 'dim');
        return;
      }
      
      const confirm = await promptUser('Proceed with auto-commit? (y/n): ');
      if (confirm.toLowerCase() !== 'y') {
        log('⏭️  Skipping auto-commit', 'yellow');
        return;
      }
    }
    
    await performCommit(changes);
  }
}

async function main() {
  // Initialize
  log('🚀 Starting Git Assistant...', 'bright');
  
  // Check if in git repository
  try {
    await execGit(['rev-parse', '--git-dir']);
  } catch {
    log('❌ Not in a git repository!', 'red');
    process.exit(1);
  }
  
  // Create necessary directories
  await fs.mkdir(path.dirname(CONFIG.stateFile), { recursive: true }).catch(() => {});
  
  // Initialize session
  await sessionTracker.startSession();
  
  // Set up keyboard handling
  handleKeypress();
  
  // Show initial status
  showStatus();
  
  // Set up interval
  const checkInterval = setInterval(async () => {
    state.nextCheckTime = Date.now() + CONFIG.checkInterval;
    await runCheck();
  }, CONFIG.checkInterval);
  
  // Set initial next check time
  state.nextCheckTime = Date.now() + CONFIG.checkInterval;
  
  // Run initial check after 5 seconds
  setTimeout(async () => {
    await runCheck();
  }, 5000);
  
  // Update status display every second
  setInterval(() => {
    if (!state.isPaused) {
      showStatus();
    }
  }, 1000);
  
  // Handle process termination
  process.on('SIGINT', async () => {
    clearInterval(checkInterval);
    await cleanup();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    clearInterval(checkInterval);
    await cleanup();
    process.exit(0);
  });
}

// Run the assistant
if (require.main === module) {
  main().catch(error => {
    log(`❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { CONFIG };