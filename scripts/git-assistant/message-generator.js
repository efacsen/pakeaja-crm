const path = require('path');

class MessageGenerator {
  constructor() {
    this.prefixMap = {
      'feature': 'feat',
      'fix': 'fix',
      'docs': 'docs',
      'style': 'style',
      'refactor': 'refactor',
      'test': 'test',
      'config': 'chore',
      'deps': 'chore',
      'update': 'update',
      'perf': 'perf',
      'ci': 'ci',
      'build': 'build',
      'revert': 'revert'
    };
    
    this.actionVerbs = {
      'feature': ['add', 'implement', 'create', 'introduce'],
      'fix': ['fix', 'resolve', 'correct', 'repair'],
      'update': ['update', 'improve', 'enhance', 'modify'],
      'refactor': ['refactor', 'reorganize', 'restructure', 'clean up'],
      'docs': ['document', 'update docs for', 'add docs for'],
      'style': ['style', 'format', 'beautify'],
      'test': ['test', 'add tests for', 'update tests for'],
      'config': ['configure', 'update config for', 'adjust'],
      'deps': ['update', 'upgrade', 'add', 'remove'],
      'perf': ['optimize', 'improve performance of', 'speed up']
    };
  }

  async generate(changes) {
    const prefix = this.prefixMap[changes.primaryChange] || 'chore';
    const scope = this.determineScope(changes);
    const subject = this.generateSubject(changes);
    
    let message = `${prefix}`;
    if (scope) {
      message += `(${scope})`;
    }
    message += `: ${subject}`;
    
    // Add body for complex changes
    if (this.needsBody(changes)) {
      const body = this.generateBody(changes);
      message += `\n\n${body}`;
    }
    
    // Add footer for breaking changes or issues
    const footer = this.generateFooter(changes);
    if (footer) {
      message += `\n\n${footer}`;
    }
    
    return message;
  }

  determineScope(changes) {
    // Priority order for scope determination
    const scopes = [];
    
    // Check modules
    if (changes.modules.size === 1) {
      return Array.from(changes.modules)[0];
    }
    
    // Check for specific file patterns
    const filePaths = changes.files.map(f => f.path);
    
    // UI components
    if (filePaths.some(p => p.includes('/components/'))) {
      scopes.push('components');
    }
    if (filePaths.some(p => p.includes('/pages/'))) {
      scopes.push('pages');
    }
    
    // Backend
    if (filePaths.some(p => p.includes('/api/'))) {
      scopes.push('api');
    }
    if (filePaths.some(p => p.includes('/services/'))) {
      scopes.push('services');
    }
    
    // Config
    if (filePaths.some(p => p.includes('config'))) {
      scopes.push('config');
    }
    
    // Database
    if (filePaths.some(p => p.includes('/models/') || p.includes('.prisma'))) {
      scopes.push('db');
    }
    
    // If multiple scopes, try to find the most specific
    if (scopes.length === 1) {
      return scopes[0];
    } else if (scopes.length > 1) {
      // Return the most specific scope
      if (changes.featureName) {
        return changes.featureName;
      }
      return scopes[0];
    }
    
    // Try to extract from common path
    if (changes.files.length > 0) {
      const commonDir = this.getCommonDirectory(filePaths);
      if (commonDir && commonDir !== '.' && commonDir !== '/') {
        const parts = commonDir.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.length > 2) {
          return lastPart;
        }
      }
    }
    
    return null;
  }

  generateSubject(changes) {
    const verbs = this.actionVerbs[changes.primaryChange] || ['update'];
    const verb = verbs[0];
    
    // Handle specific cases
    if (changes.primaryChange === 'feature' && changes.featureName) {
      return `${verb} ${this.humanize(changes.featureName)} functionality`;
    }
    
    if (changes.primaryChange === 'deps') {
      const depsFiles = changes.files.filter(f => f.type === 'deps');
      if (depsFiles.length > 0) {
        const fileName = path.basename(depsFiles[0].path);
        if (fileName.includes('package')) {
          return 'update npm dependencies';
        } else if (fileName.includes('requirements')) {
          return 'update Python dependencies';
        } else if (fileName.includes('Gemfile')) {
          return 'update Ruby dependencies';
        }
      }
      return 'update dependencies';
    }
    
    // Single file change
    if (changes.files.length === 1) {
      const file = changes.files[0];
      const fileName = path.basename(file.path, path.extname(file.path));
      
      if (file.isNew) {
        return `add ${this.humanize(fileName)}`;
      } else if (file.isDeleted) {
        return `remove ${this.humanize(fileName)}`;
      } else {
        return `${verb} ${this.humanize(fileName)}`;
      }
    }
    
    // Multiple files in same module
    if (changes.modules.size === 1) {
      const module = Array.from(changes.modules)[0];
      return `${verb} ${module} module`;
    }
    
    // Multiple files of same type
    if (changes.types.size === 1) {
      const type = Array.from(changes.types)[0];
      return `${verb} ${type} files`;
    }
    
    // Generic multi-file change
    const summary = [];
    if (changes.stats.added > 0) summary.push(`${changes.stats.added} additions`);
    if (changes.stats.modified > 0) summary.push(`${changes.stats.modified} modifications`);
    if (changes.stats.deleted > 0) summary.push(`${changes.stats.deleted} deletions`);
    
    return `${verb} multiple files (${summary.join(', ')})`;
  }

  needsBody(changes) {
    return changes.files.length > 3 || 
           changes.isNewFeature || 
           changes.modules.size > 2 ||
           (changes.stats.added + changes.stats.deleted) > 50;
  }

  generateBody(changes) {
    const lines = [];
    
    if (changes.isNewFeature) {
      lines.push(`Implemented ${changes.featureName || 'new feature'} with the following components:`);
      lines.push('');
    }
    
    // Group files by type/module
    const fileGroups = this.groupFiles(changes.files);
    
    for (const [group, files] of Object.entries(fileGroups)) {
      if (files.length === 0) continue;
      
      lines.push(`${this.capitalize(group)}:`);
      files.slice(0, 5).forEach(file => {
        const action = file.isNew ? 'Added' : file.isDeleted ? 'Removed' : 'Modified';
        lines.push(`- ${action} ${file.path}`);
      });
      
      if (files.length > 5) {
        lines.push(`- ...and ${files.length - 5} more files`);
      }
      lines.push('');
    }
    
    // Add statistics for large changes
    if ((changes.stats.added + changes.stats.deleted) > 50) {
      lines.push('Statistics:');
      lines.push(`- Lines added: ~${changes.stats.added * 20}`);
      lines.push(`- Lines removed: ~${changes.stats.deleted * 15}`);
      lines.push(`- Files affected: ${changes.files.length}`);
    }
    
    return lines.join('\n').trim();
  }

  generateFooter(changes) {
    const footerLines = [];
    
    // Check for potential breaking changes
    if (changes.files.some(f => f.path.includes('api') && f.isDeleted)) {
      footerLines.push('BREAKING CHANGE: API endpoints removed');
    }
    
    if (changes.files.some(f => f.path.includes('model') && f.status === 'modified')) {
      footerLines.push('Note: Database schema changes may require migration');
    }
    
    // Add related issue numbers if detected in file names
    const issueNumbers = this.extractIssueNumbers(changes.files);
    if (issueNumbers.length > 0) {
      footerLines.push(`Closes: ${issueNumbers.map(n => `#${n}`).join(', ')}`);
    }
    
    return footerLines.join('\n');
  }

  groupFiles(files) {
    const groups = {
      components: [],
      api: [],
      services: [],
      models: [],
      tests: [],
      config: [],
      docs: [],
      other: []
    };
    
    for (const file of files) {
      if (file.module === 'ui' || file.path.includes('/components/')) {
        groups.components.push(file);
      } else if (file.module === 'api' || file.path.includes('/api/')) {
        groups.api.push(file);
      } else if (file.module === 'utils' || file.path.includes('/services/')) {
        groups.services.push(file);
      } else if (file.module === 'database' || file.path.includes('/models/')) {
        groups.models.push(file);
      } else if (file.module === 'test') {
        groups.tests.push(file);
      } else if (file.module === 'config' || file.type === 'config') {
        groups.config.push(file);
      } else if (file.type === 'docs') {
        groups.docs.push(file);
      } else {
        groups.other.push(file);
      }
    }
    
    // Remove empty groups
    return Object.fromEntries(
      Object.entries(groups).filter(([_, files]) => files.length > 0)
    );
  }

  getCommonDirectory(paths) {
    if (paths.length === 0) return null;
    if (paths.length === 1) return path.dirname(paths[0]);
    
    const dirs = paths.map(p => path.dirname(p));
    const parts = dirs[0].split('/');
    let common = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (dirs.every(d => d.split('/')[i] === parts[i])) {
        common.push(parts[i]);
      } else {
        break;
      }
    }
    
    return common.join('/');
  }

  humanize(str) {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  extractIssueNumbers(files) {
    const numbers = new Set();
    
    for (const file of files) {
      const matches = file.path.match(/#(\d+)/g);
      if (matches) {
        matches.forEach(m => numbers.add(m.substring(1)));
      }
    }
    
    return Array.from(numbers);
  }
}

module.exports = new MessageGenerator();