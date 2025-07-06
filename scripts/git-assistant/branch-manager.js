const { spawn } = require('child_process');

class BranchManager {
  constructor() {
    this.branchPrefixes = {
      feature: 'feature/',
      fix: 'fix/',
      hotfix: 'hotfix/',
      release: 'release/',
      chore: 'chore/',
      docs: 'docs/',
      test: 'test/',
      refactor: 'refactor/'
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

  async getCurrentBranch() {
    try {
      const branch = await this.execGit(['rev-parse', '--abbrev-ref', 'HEAD']);
      return branch;
    } catch {
      return 'main';
    }
  }

  async getAllBranches() {
    try {
      const output = await this.execGit(['branch', '-a']);
      return output.split('\n')
        .map(b => b.trim().replace('* ', ''))
        .filter(b => b);
    } catch {
      return [];
    }
  }

  async createFeatureBranch(featureName, changeType = 'feature') {
    const prefix = this.branchPrefixes[changeType] || 'feature/';
    const date = new Date().toISOString().split('T')[0];
    const sanitizedName = this.sanitizeBranchName(featureName);
    
    let branchName = `${prefix}${sanitizedName}-${date}`;
    
    // Check if branch already exists
    const existingBranches = await this.getAllBranches();
    if (existingBranches.includes(branchName)) {
      // Add a counter if branch exists
      let counter = 1;
      while (existingBranches.includes(`${branchName}-${counter}`)) {
        counter++;
      }
      branchName = `${branchName}-${counter}`;
    }
    
    try {
      // Create and checkout the new branch
      await this.execGit(['checkout', '-b', branchName]);
      return branchName;
    } catch (error) {
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }

  sanitizeBranchName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')  // Replace non-alphanumeric with hyphens
      .replace(/-+/g, '-')           // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
      .substring(0, 50);             // Limit length
  }

  async switchToBranch(branchName) {
    try {
      await this.execGit(['checkout', branchName]);
      return true;
    } catch {
      return false;
    }
  }

  async mergeBranch(sourceBranch, targetBranch = 'main') {
    try {
      // Save current branch
      const currentBranch = await this.getCurrentBranch();
      
      // Switch to target branch
      await this.execGit(['checkout', targetBranch]);
      
      // Pull latest changes
      await this.execGit(['pull', 'origin', targetBranch]).catch(() => {});
      
      // Merge source branch
      await this.execGit(['merge', sourceBranch, '--no-ff']);
      
      // Return to original branch if different
      if (currentBranch !== targetBranch) {
        await this.execGit(['checkout', currentBranch]);
      }
      
      return true;
    } catch (error) {
      throw new Error(`Merge failed: ${error.message}`);
    }
  }

  async deleteBranch(branchName, force = false) {
    try {
      const flag = force ? '-D' : '-d';
      await this.execGit(['branch', flag, branchName]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete branch: ${error.message}`);
    }
  }

  async getCommitsSinceMain(branchName = null) {
    try {
      const currentBranch = branchName || await this.getCurrentBranch();
      const commits = await this.execGit([
        'log',
        `main..${currentBranch}`,
        '--oneline',
        '--no-merges'
      ]);
      
      return commits.split('\n').filter(c => c);
    } catch {
      return [];
    }
  }

  async shouldCreateFeatureBranch(changes) {
    // Determine if changes warrant a feature branch
    if (changes.isNewFeature) {
      return true;
    }
    
    // Check if we're adding significant functionality
    const newFiles = changes.files.filter(f => f.isNew);
    const hasSignificantAdditions = newFiles.length >= 3 || 
                                   changes.stats.added > 50;
    
    // Check if we're modifying multiple modules
    const hasMultipleModules = changes.modules.size >= 3;
    
    // Check current branch
    const currentBranch = await this.getCurrentBranch();
    const isOnMainBranch = ['main', 'master', 'develop'].includes(currentBranch);
    
    return isOnMainBranch && (hasSignificantAdditions || hasMultipleModules);
  }

  async suggestBranchName(changes) {
    let suggestion = '';
    
    if (changes.featureName) {
      suggestion = changes.featureName;
    } else if (changes.modules.size === 1) {
      const module = Array.from(changes.modules)[0];
      suggestion = `update-${module}`;
    } else if (changes.primaryChange) {
      suggestion = changes.primaryChange;
    } else {
      suggestion = 'update';
    }
    
    return this.sanitizeBranchName(suggestion);
  }

  async getFeatureBranchStatus() {
    const currentBranch = await this.getCurrentBranch();
    
    if (!currentBranch.includes('/')) {
      return null;
    }
    
    const commits = await this.getCommitsSinceMain();
    const ahead = commits.length;
    
    // Check if branch is behind main
    let behind = 0;
    try {
      const behindCommits = await this.execGit([
        'log',
        `${currentBranch}..main`,
        '--oneline'
      ]);
      behind = behindCommits.split('\n').filter(c => c).length;
    } catch {
      // Ignore errors
    }
    
    return {
      branch: currentBranch,
      ahead,
      behind,
      commits,
      needsRebase: behind > 0
    };
  }

  async cleanupOldBranches(daysOld = 30) {
    const branches = await this.getAllBranches();
    const currentBranch = await this.getCurrentBranch();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const oldBranches = [];
    
    for (const branch of branches) {
      // Skip current, main branches, and remote branches
      if (branch === currentBranch || 
          ['main', 'master', 'develop'].includes(branch) ||
          branch.includes('remotes/')) {
        continue;
      }
      
      try {
        // Get last commit date
        const lastCommit = await this.execGit([
          'log',
          '-1',
          '--format=%ci',
          branch
        ]);
        
        const commitDate = new Date(lastCommit);
        if (commitDate < cutoffDate) {
          oldBranches.push({
            name: branch,
            lastCommit: commitDate.toISOString().split('T')[0]
          });
        }
      } catch {
        // Skip branches we can't check
      }
    }
    
    return oldBranches;
  }
}

module.exports = new BranchManager();