# Git Assistant

An intelligent, automated git commit assistant that monitors your repository for changes and creates meaningful commits with smart messages.

## Features

### 🤖 Core Functionality
- **Continuous Monitoring**: Checks for changes every 30 minutes
- **Smart Commit Messages**: Analyzes changes to generate contextual commit messages
- **Security Scanning**: Prevents accidental commits of sensitive data (API keys, passwords, etc.)
- **Interactive Controls**: Real-time keyboard controls for manual commits and status checks

### 🌿 Advanced Features
- **Intelligent Branch Creation**: Auto-suggests feature branches for significant changes
- **PR Description Generator**: Creates comprehensive pull request descriptions
- **Work Session Tracking**: Monitors coding sessions with time tracking and statistics
- **TODO Extraction**: Automatically extracts TODO items from commit messages

### 🛡️ Safety Features
- **Dry Run Mode**: Test the assistant without making actual commits
- **Sensitive Data Detection**: Scans for 15+ patterns of sensitive information
- **File Size Limits**: Prevents commits of files larger than 10MB
- **Ignore Patterns**: Customizable exclusion patterns via `.gitassistantignore`

## Quick Start

```bash
# Install dependencies
npm install

# Run the assistant
npm run git:assistant

# Run in dry-run mode (no actual commits)
npm run git:assistant:dev

# Run with verbose logging
npm run git:assistant:verbose
```

## Interactive Commands

While the assistant is running, use these keyboard shortcuts:

- **[P]** - Pause/Resume monitoring
- **[C]** - Trigger manual commit now
- **[S]** - Show current status
- **[Q]** - Quit the assistant

## How It Works

### 1. Change Analysis
The assistant analyzes your changes to determine:
- Type of change (feature, fix, refactor, etc.)
- Affected modules (auth, api, ui, database, etc.)
- Whether it's a new feature requiring a branch
- File complexity and size

### 2. Commit Message Generation
Based on the analysis, it generates conventional commit messages:
```
feat(auth): add two-factor authentication support
fix(api): resolve timeout issue in user endpoint
refactor(database): optimize query performance
chore(deps): update npm dependencies
```

### 3. Security Scanning
Before committing, it scans for:
- API keys and tokens
- Database passwords and connection strings
- Private keys and certificates
- Credit card patterns
- OAuth secrets

### 4. Work Session Tracking
Tracks your development sessions including:
- Session duration
- Number of commits
- Files changed
- Features worked on

## Configuration

### .gitassistantignore
Create this file in your project root to exclude files/patterns:
```
node_modules/
dist/
.env*
*.log
```

### Environment Variables
- `GIT_ASSISTANT_INTERVAL` - Check interval in minutes (default: 30)
- `GIT_ASSISTANT_MAX_FILE_SIZE` - Max file size in MB (default: 10)

## File Structure

```
scripts/
└── git-assistant/
    ├── analyzer.js          # Change analysis logic
    ├── message-generator.js # Commit message generation
    ├── sensitive-detector.js # Security scanning
    ├── branch-manager.js    # Branch operations
    ├── session-tracker.js   # Work session tracking
    └── pr-generator.js      # PR description generation

.claude/
├── current-state.md    # Current work status
├── sessions.json       # Session history
└── git-assistant.log   # Operation logs
```

## Generated Files

### .claude/current-state.md
Automatically updated with:
- Current session information
- Recent commits and changes
- Work summary
- Next steps

### .claude/sessions.json
Stores historical session data for reporting

### .claude/git-assistant.log
Detailed operation logs for debugging

## Example Output

```
🤖 Git Assistant Active
⏰ Next auto-commit in: 27:35
📝 Tracking changes in: /Users/you/project
🔍 Changed files: 3 (2 modified, 1 new)
✅ Commits this session: 2
⏱️  Session duration: 1:45:23

Commands:
  [P] Pause/Resume   [C] Commit now   [S] Status   [Q] Quit
```

## Safety Considerations

1. **Review Commits**: Occasionally review auto-generated commits
2. **Pause During Conflicts**: Stop the assistant during merges/rebases
3. **Check Sensitive Files**: Ensure `.gitassistantignore` includes all sensitive paths
4. **Test First**: Use dry-run mode when first setting up

## Troubleshooting

### Assistant won't start
- Ensure you're in a git repository
- Check that Node.js is installed
- Verify all dependencies are installed

### Commits are being skipped
- Check `.gitassistantignore` patterns
- Look for sensitive data warnings in the output
- Verify files aren't too large (>10MB)

### Wrong commit messages
- The assistant learns from your file structure
- Ensure consistent naming conventions
- Use descriptive file and directory names

## Advanced Usage

### Creating Feature Branches
When significant changes are detected, the assistant will prompt:
```
Create a feature branch for these changes? (y/n):
```

It will create branches like:
- `feature/user-authentication-2024-01-06`
- `fix/login-redirect-2024-01-06`

### Generating PR Descriptions
After working on a feature branch:
```javascript
const prGenerator = require('./scripts/git-assistant/pr-generator');
const pr = await prGenerator.generatePRDescription();
console.log(pr.title);
console.log(pr.body);
```

### Work Reports
Generate daily or weekly work summaries:
```javascript
const sessionTracker = require('./scripts/git-assistant/session-tracker');
const report = await sessionTracker.generateWorkReport('markdown');
```

## Best Practices

1. **Commit Frequency**: 30 minutes is a good default, adjust based on your workflow
2. **Branch Strategy**: Let the assistant create feature branches for significant work
3. **TODO Comments**: Add TODO/FIXME comments in commits for automatic tracking
4. **Ignore Patterns**: Keep `.gitassistantignore` updated with build outputs
5. **Session Reviews**: Check `.claude/current-state.md` periodically

## Contributing

The Git Assistant is designed to be extensible. Key areas for enhancement:
- Additional sensitive data patterns
- More sophisticated commit message generation
- Integration with issue tracking systems
- Custom commit message templates
- Language-specific change analysis