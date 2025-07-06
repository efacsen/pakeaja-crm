const { spawn } = require('child_process');
const branchManager = require('./branch-manager');

class PRGenerator {
  constructor() {
    this.templates = {
      feature: {
        title: 'feat: {description}',
        sections: ['Summary', 'Changes', 'Testing', 'Screenshots']
      },
      fix: {
        title: 'fix: {description}',
        sections: ['Summary', 'Root Cause', 'Solution', 'Testing']
      },
      refactor: {
        title: 'refactor: {description}',
        sections: ['Summary', 'Motivation', 'Changes', 'Impact']
      },
      docs: {
        title: 'docs: {description}',
        sections: ['Summary', 'Updates', 'Review Notes']
      }
    };
  }

  async execGit(args) {
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

  async generatePRDescription(branch = null) {
    const currentBranch = branch || await branchManager.getCurrentBranch();
    const commits = await branchManager.getCommitsSinceMain(currentBranch);
    
    if (commits.length === 0) {
      return null;
    }
    
    // Analyze commits to determine PR type
    const analysis = await this.analyzeCommits(commits);
    
    // Generate title
    const title = this.generateTitle(analysis);
    
    // Generate body
    const body = await this.generateBody(analysis, commits);
    
    return { title, body };
  }

  async analyzeCommits(commits) {
    const analysis = {
      type: 'feature',
      modules: new Set(),
      features: [],
      fixes: [],
      breakingChanges: [],
      filesChanged: new Set(),
      description: ''
    };
    
    // Get detailed commit information
    const detailedCommits = [];
    for (const commit of commits) {
      const hash = commit.split(' ')[0];
      
      try {
        // Get commit message
        const message = await this.execGit(['log', '-1', '--format=%s', hash]);
        const body = await this.execGit(['log', '-1', '--format=%b', hash]);
        
        // Get changed files
        const files = await this.execGit(['diff-tree', '--no-commit-id', '--name-only', '-r', hash]);
        const fileList = files.split('\n').filter(f => f);
        
        detailedCommits.push({
          hash,
          message,
          body,
          files: fileList
        });
        
        // Track files
        fileList.forEach(f => analysis.filesChanged.add(f));
        
        // Analyze commit type
        if (message.startsWith('feat')) {
          analysis.features.push(message);
        } else if (message.startsWith('fix')) {
          analysis.fixes.push(message);
          if (!analysis.features.length) analysis.type = 'fix';
        } else if (message.startsWith('refactor')) {
          if (!analysis.features.length && !analysis.fixes.length) {
            analysis.type = 'refactor';
          }
        } else if (message.startsWith('docs')) {
          if (!analysis.features.length && !analysis.fixes.length) {
            analysis.type = 'docs';
          }
        }
        
        // Check for breaking changes
        if (body.includes('BREAKING CHANGE')) {
          analysis.breakingChanges.push({
            commit: message,
            description: body.split('BREAKING CHANGE')[1].trim()
          });
        }
        
        // Extract modules
        const moduleMatch = message.match(/\(([^)]+)\)/);
        if (moduleMatch) {
          analysis.modules.add(moduleMatch[1]);
        }
      } catch {
        // Skip commits we can't analyze
      }
    }
    
    // Generate description
    if (analysis.features.length > 0) {
      const mainFeature = analysis.features[0].replace(/^feat(\([^)]+\))?:\s*/, '');
      analysis.description = mainFeature;
    } else if (analysis.fixes.length > 0) {
      const mainFix = analysis.fixes[0].replace(/^fix(\([^)]+\))?:\s*/, '');
      analysis.description = mainFix;
    } else if (detailedCommits.length > 0) {
      analysis.description = detailedCommits[0].message.replace(/^[^:]+:\s*/, '');
    }
    
    analysis.commits = detailedCommits;
    return analysis;
  }

  generateTitle(analysis) {
    const template = this.templates[analysis.type] || this.templates.feature;
    let title = template.title.replace('{description}', analysis.description);
    
    // Add module scope if consistent
    if (analysis.modules.size === 1) {
      const module = Array.from(analysis.modules)[0];
      title = title.replace(`${analysis.type}:`, `${analysis.type}(${module}):`);
    }
    
    return title;
  }

  async generateBody(analysis, commits) {
    const sections = [];
    
    // Summary section
    sections.push('## Summary');
    sections.push(this.generateSummary(analysis));
    sections.push('');
    
    // Type-specific sections
    if (analysis.type === 'fix') {
      sections.push('## Root Cause');
      sections.push('_Describe what caused the issue_');
      sections.push('');
      
      sections.push('## Solution');
      sections.push(this.describeSolution(analysis));
      sections.push('');
    } else if (analysis.type === 'refactor') {
      sections.push('## Motivation');
      sections.push('_Why was this refactoring necessary?_');
      sections.push('');
    }
    
    // Changes section
    sections.push('## Changes');
    sections.push(this.describeChanges(analysis));
    sections.push('');
    
    // Breaking changes
    if (analysis.breakingChanges.length > 0) {
      sections.push('## ⚠️ Breaking Changes');
      analysis.breakingChanges.forEach(bc => {
        sections.push(`- ${bc.description}`);
      });
      sections.push('');
    }
    
    // Testing section
    sections.push('## Testing');
    sections.push(this.generateTestingChecklist(analysis));
    sections.push('');
    
    // Screenshots placeholder
    if (analysis.filesChanged.size > 0 && 
        Array.from(analysis.filesChanged).some(f => 
          f.includes('component') || f.includes('.tsx') || f.includes('.jsx')
        )) {
      sections.push('## Screenshots');
      sections.push('_Add screenshots if UI changes are included_');
      sections.push('');
    }
    
    // Commit list
    sections.push('## Commits');
    commits.forEach(commit => {
      sections.push(`- ${commit}`);
    });
    sections.push('');
    
    // Files changed
    if (analysis.filesChanged.size > 0) {
      sections.push('## Files Changed');
      const files = Array.from(analysis.filesChanged);
      
      if (files.length > 10) {
        sections.push(`${files.length} files changed across ${analysis.modules.size || 1} modules`);
        
        // Group by directory
        const groups = this.groupFilesByDirectory(files);
        for (const [dir, dirFiles] of Object.entries(groups)) {
          sections.push(`- \`${dir}/\` (${dirFiles.length} files)`);
        }
      } else {
        files.forEach(file => {
          sections.push(`- \`${file}\``);
        });
      }
    }
    
    return sections.join('\n');
  }

  generateSummary(analysis) {
    const lines = [];
    
    if (analysis.features.length > 0) {
      lines.push(`This PR implements ${analysis.features.length} new feature${analysis.features.length > 1 ? 's' : ''}:`);
      analysis.features.slice(0, 3).forEach(feat => {
        const clean = feat.replace(/^feat(\([^)]+\))?:\s*/, '');
        lines.push(`- ${clean}`);
      });
      if (analysis.features.length > 3) {
        lines.push(`- ...and ${analysis.features.length - 3} more`);
      }
    } else if (analysis.fixes.length > 0) {
      lines.push(`This PR fixes ${analysis.fixes.length} issue${analysis.fixes.length > 1 ? 's' : ''}:`);
      analysis.fixes.forEach(fix => {
        const clean = fix.replace(/^fix(\([^)]+\))?:\s*/, '');
        lines.push(`- ${clean}`);
      });
    } else if (analysis.type === 'refactor') {
      lines.push('This PR refactors existing code to improve maintainability and performance.');
    } else if (analysis.type === 'docs') {
      lines.push('This PR updates documentation.');
    } else {
      lines.push(`This PR includes ${analysis.commits.length} commits with various improvements.`);
    }
    
    return lines.join('\n');
  }

  describeSolution(analysis) {
    const lines = [];
    
    if (analysis.fixes.length > 0) {
      lines.push('The following changes were made to resolve the issues:');
      
      // Analyze file changes to describe solution
      const fileTypes = new Set();
      analysis.filesChanged.forEach(file => {
        if (file.includes('.ts') || file.includes('.js')) fileTypes.add('code logic');
        if (file.includes('.tsx') || file.includes('.jsx')) fileTypes.add('UI components');
        if (file.includes('.css') || file.includes('.scss')) fileTypes.add('styles');
        if (file.includes('test')) fileTypes.add('tests');
      });
      
      if (fileTypes.size > 0) {
        lines.push(`- Updated ${Array.from(fileTypes).join(', ')}`);
      }
    }
    
    return lines.join('\n') || '_Describe how the issue was resolved_';
  }

  describeChanges(analysis) {
    const lines = [];
    
    // Group commits by type
    const grouped = {
      features: [],
      fixes: [],
      refactors: [],
      docs: [],
      tests: [],
      other: []
    };
    
    analysis.commits.forEach(commit => {
      const msg = commit.message;
      if (msg.startsWith('feat')) grouped.features.push(msg);
      else if (msg.startsWith('fix')) grouped.fixes.push(msg);
      else if (msg.startsWith('refactor')) grouped.refactors.push(msg);
      else if (msg.startsWith('docs')) grouped.docs.push(msg);
      else if (msg.startsWith('test')) grouped.tests.push(msg);
      else grouped.other.push(msg);
    });
    
    // Format grouped changes
    if (grouped.features.length > 0) {
      lines.push('### New Features');
      grouped.features.forEach(msg => {
        lines.push(`- ${msg.replace(/^feat(\([^)]+\))?:\s*/, '')}`);
      });
      lines.push('');
    }
    
    if (grouped.fixes.length > 0) {
      lines.push('### Bug Fixes');
      grouped.fixes.forEach(msg => {
        lines.push(`- ${msg.replace(/^fix(\([^)]+\))?:\s*/, '')}`);
      });
      lines.push('');
    }
    
    if (grouped.refactors.length > 0) {
      lines.push('### Refactoring');
      grouped.refactors.forEach(msg => {
        lines.push(`- ${msg.replace(/^refactor(\([^)]+\))?:\s*/, '')}`);
      });
      lines.push('');
    }
    
    if (grouped.docs.length > 0) {
      lines.push('### Documentation');
      grouped.docs.forEach(msg => {
        lines.push(`- ${msg.replace(/^docs(\([^)]+\))?:\s*/, '')}`);
      });
      lines.push('');
    }
    
    if (grouped.tests.length > 0) {
      lines.push('### Tests');
      grouped.tests.forEach(msg => {
        lines.push(`- ${msg.replace(/^test(\([^)]+\))?:\s*/, '')}`);
      });
      lines.push('');
    }
    
    if (grouped.other.length > 0) {
      lines.push('### Other Changes');
      grouped.other.forEach(msg => {
        lines.push(`- ${msg}`);
      });
    }
    
    return lines.join('\n').trim();
  }

  generateTestingChecklist(analysis) {
    const checklist = [];
    
    // Always include basic checks
    checklist.push('- [ ] All existing tests pass');
    checklist.push('- [ ] New functionality has been tested locally');
    
    // Add specific checks based on changes
    if (analysis.features.length > 0) {
      checklist.push('- [ ] New features work as expected');
      checklist.push('- [ ] Edge cases have been considered');
    }
    
    if (analysis.fixes.length > 0) {
      checklist.push('- [ ] The reported issue has been resolved');
      checklist.push('- [ ] No regressions introduced');
    }
    
    if (Array.from(analysis.filesChanged).some(f => f.includes('api'))) {
      checklist.push('- [ ] API endpoints tested with various inputs');
      checklist.push('- [ ] Error handling verified');
    }
    
    if (Array.from(analysis.filesChanged).some(f => f.includes('.tsx') || f.includes('.jsx'))) {
      checklist.push('- [ ] UI changes tested in different browsers');
      checklist.push('- [ ] Responsive design verified');
    }
    
    if (analysis.breakingChanges.length > 0) {
      checklist.push('- [ ] Migration guide provided for breaking changes');
      checklist.push('- [ ] Downstream impacts assessed');
    }
    
    return checklist.join('\n');
  }

  groupFilesByDirectory(files) {
    const groups = {};
    
    files.forEach(file => {
      const dir = file.split('/').slice(0, -1).join('/') || 'root';
      if (!groups[dir]) {
        groups[dir] = [];
      }
      groups[dir].push(file);
    });
    
    return groups;
  }

  async createPR(branch, targetBranch = 'main', isDraft = false) {
    const prData = await this.generatePRDescription(branch);
    
    if (!prData) {
      throw new Error('No commits found to create PR');
    }
    
    const args = [
      'pr', 'create',
      '--title', prData.title,
      '--body', prData.body,
      '--base', targetBranch
    ];
    
    if (isDraft) {
      args.push('--draft');
    }
    
    try {
      // Check if gh CLI is available
      await this.execGit(['--version']);
      
      // Create PR using gh CLI
      const result = await new Promise((resolve, reject) => {
        const gh = spawn('gh', args, { cwd: process.cwd() });
        let stdout = '';
        let stderr = '';

        gh.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        gh.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        gh.on('close', (code) => {
          if (code === 0) {
            resolve(stdout.trim());
          } else {
            reject(new Error(stderr || stdout));
          }
        });
      });
      
      return result;
    } catch (error) {
      // If gh CLI is not available, return the PR data for manual creation
      return {
        title: prData.title,
        body: prData.body,
        error: 'GitHub CLI not available. Please install gh CLI or create PR manually.'
      };
    }
  }
}

module.exports = new PRGenerator();