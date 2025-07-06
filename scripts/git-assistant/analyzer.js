const fs = require('fs').promises;
const path = require('path');
const { minimatch } = require('minimatch');

class ChangeAnalyzer {
  constructor() {
    this.fileTypeMap = {
      // Source code
      '.js': 'javascript',
      '.jsx': 'react',
      '.ts': 'typescript',
      '.tsx': 'react',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.go': 'go',
      '.rs': 'rust',
      '.php': 'php',
      '.rb': 'ruby',
      '.swift': 'swift',
      '.kt': 'kotlin',
      
      // Web
      '.html': 'html',
      '.css': 'styles',
      '.scss': 'styles',
      '.sass': 'styles',
      '.less': 'styles',
      
      // Data
      '.json': 'config',
      '.xml': 'config',
      '.yaml': 'config',
      '.yml': 'config',
      '.toml': 'config',
      '.env': 'config',
      '.ini': 'config',
      
      // Docs
      '.md': 'docs',
      '.txt': 'docs',
      '.rst': 'docs',
      
      // Database
      '.sql': 'database',
      '.prisma': 'database',
      
      // Build
      'package.json': 'deps',
      'package-lock.json': 'deps',
      'yarn.lock': 'deps',
      'Gemfile': 'deps',
      'Gemfile.lock': 'deps',
      'requirements.txt': 'deps',
      'go.mod': 'deps',
      'go.sum': 'deps',
      'Cargo.toml': 'deps',
      'Cargo.lock': 'deps',
      
      // Config
      '.gitignore': 'config',
      '.eslintrc': 'config',
      '.prettierrc': 'config',
      'tsconfig.json': 'config',
      'webpack.config.js': 'config',
      'vite.config.js': 'config',
      'next.config.js': 'config',
      
      // Testing
      '.test.js': 'test',
      '.spec.js': 'test',
      '.test.ts': 'test',
      '.spec.ts': 'test'
    };
    
    this.modulePatterns = {
      'auth': /auth|login|signup|session|token|password/i,
      'api': /api|endpoint|route|controller/i,
      'ui': /component|page|view|layout|style/i,
      'database': /model|schema|migration|query/i,
      'utils': /util|helper|lib|service/i,
      'config': /config|setting|env/i,
      'test': /test|spec|mock/i,
      'docs': /readme|doc|guide/i
    };
  }

  async analyzeChanges(statusLines, ignorePatterns) {
    const changes = {
      files: [],
      stats: {
        added: 0,
        modified: 0,
        deleted: 0,
        renamed: 0
      },
      modules: new Set(),
      types: new Set(),
      isNewFeature: false,
      featureName: null,
      primaryChange: null
    };

    for (const line of statusLines) {
      if (!line.trim()) continue;
      
      const status = line.substring(0, 2);
      const filePath = line.substring(3);
      
      // Check ignore patterns
      if (this.shouldIgnore(filePath, ignorePatterns)) {
        continue;
      }
      
      const fileInfo = await this.analyzeFile(filePath, status);
      if (fileInfo) {
        changes.files.push(fileInfo);
        
        // Update stats
        if (status.includes('A')) changes.stats.added++;
        else if (status.includes('M')) changes.stats.modified++;
        else if (status.includes('D')) changes.stats.deleted++;
        else if (status.includes('R')) changes.stats.renamed++;
        
        // Track modules and types
        if (fileInfo.module) changes.modules.add(fileInfo.module);
        if (fileInfo.type) changes.types.add(fileInfo.type);
      }
    }
    
    // Analyze for new features
    this.detectNewFeature(changes);
    
    // Determine primary change type
    changes.primaryChange = this.determinePrimaryChange(changes);
    
    return changes;
  }

  shouldIgnore(filePath, patterns) {
    for (const pattern of patterns) {
      if (minimatch(filePath, pattern)) {
        return true;
      }
    }
    return false;
  }

  async analyzeFile(filePath, status) {
    const ext = path.extname(filePath);
    const basename = path.basename(filePath);
    const dirname = path.dirname(filePath);
    
    const fileInfo = {
      path: filePath,
      status: this.parseStatus(status),
      type: this.fileTypeMap[ext] || this.fileTypeMap[basename] || 'other',
      module: this.detectModule(filePath),
      isNew: status.includes('A'),
      isDeleted: status.includes('D'),
      size: 0,
      complexity: 'low'
    };
    
    // Try to get file size for non-deleted files
    if (!fileInfo.isDeleted) {
      try {
        const stats = await fs.stat(filePath);
        fileInfo.size = stats.size;
        
        // Estimate complexity based on file size and type
        if (fileInfo.type === 'javascript' || fileInfo.type === 'typescript') {
          if (stats.size > 10000) fileInfo.complexity = 'high';
          else if (stats.size > 3000) fileInfo.complexity = 'medium';
        }
      } catch (error) {
        // File might not exist yet
      }
    }
    
    return fileInfo;
  }

  parseStatus(status) {
    const statusMap = {
      'A ': 'new',
      'M ': 'modified',
      'D ': 'deleted',
      'R ': 'renamed',
      '??': 'untracked',
      'AM': 'added-modified',
      'MM': 'modified-modified'
    };
    
    return statusMap[status] || 'unknown';
  }

  detectModule(filePath) {
    const pathLower = filePath.toLowerCase();
    
    for (const [module, pattern] of Object.entries(this.modulePatterns)) {
      if (pattern.test(pathLower)) {
        return module;
      }
    }
    
    // Check directory structure
    if (pathLower.includes('/components/')) return 'ui';
    if (pathLower.includes('/pages/')) return 'ui';
    if (pathLower.includes('/api/')) return 'api';
    if (pathLower.includes('/lib/')) return 'utils';
    if (pathLower.includes('/utils/')) return 'utils';
    if (pathLower.includes('/services/')) return 'utils';
    if (pathLower.includes('/models/')) return 'database';
    if (pathLower.includes('/tests/')) return 'test';
    
    return null;
  }

  detectNewFeature(changes) {
    // Check if this looks like a new feature
    const newFiles = changes.files.filter(f => f.isNew);
    
    if (newFiles.length >= 3) {
      changes.isNewFeature = true;
      
      // Try to determine feature name from file paths
      const commonPath = this.findCommonPath(newFiles.map(f => f.path));
      if (commonPath) {
        const parts = commonPath.split('/');
        changes.featureName = parts[parts.length - 1] || 'new-feature';
      }
    }
    
    // Check for feature-like patterns
    const hasComponent = changes.files.some(f => f.path.includes('component'));
    const hasApi = changes.files.some(f => f.module === 'api');
    const hasModel = changes.files.some(f => f.module === 'database');
    
    if (hasComponent && (hasApi || hasModel)) {
      changes.isNewFeature = true;
      if (!changes.featureName) {
        changes.featureName = this.extractFeatureName(changes.files);
      }
    }
  }

  findCommonPath(paths) {
    if (paths.length === 0) return null;
    if (paths.length === 1) return path.dirname(paths[0]);
    
    const parts = paths[0].split('/');
    let common = [];
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (paths.every(p => p.split('/')[i] === part)) {
        common.push(part);
      } else {
        break;
      }
    }
    
    return common.join('/');
  }

  extractFeatureName(files) {
    // Try to extract feature name from file names
    const fileNames = files.map(f => path.basename(f.path, path.extname(f.path)));
    
    // Look for common patterns
    for (const name of fileNames) {
      if (name.length > 3 && !['index', 'main', 'app', 'config'].includes(name)) {
        return name.replace(/[-_]/g, '-').toLowerCase();
      }
    }
    
    return 'new-feature';
  }

  determinePrimaryChange(changes) {
    // Prioritize change types
    if (changes.isNewFeature) return 'feature';
    if (changes.modules.has('test')) return 'test';
    if (changes.types.has('docs')) return 'docs';
    if (changes.modules.has('config')) return 'config';
    if (changes.stats.deleted > changes.stats.added) return 'refactor';
    if (changes.files.some(f => f.path.includes('fix'))) return 'fix';
    if (changes.types.has('styles')) return 'style';
    if (changes.types.has('deps')) return 'deps';
    
    // Default based on stats
    if (changes.stats.added > changes.stats.modified) return 'feature';
    return 'update';
  }
}

module.exports = new ChangeAnalyzer();