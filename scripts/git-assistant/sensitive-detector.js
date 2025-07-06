const fs = require('fs').promises;
const path = require('path');

class SensitiveDetector {
  constructor() {
    // Patterns for detecting sensitive information
    this.patterns = {
      // API Keys and Tokens
      apiKey: {
        regex: /(?:api[_-]?key|apikey|api[_-]?token|api[_-]?secret)[\s]*[:=][\s]*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
        reason: 'API key detected'
      },
      awsKey: {
        regex: /(?:AWS|aws|Aws)?(?:ACCESS|access|Access)?(?:KEY|key|Key)?(?:ID|id|Id)?[\s]*[:=][\s]*['"]?([A-Z0-9]{20})['"]?/g,
        reason: 'AWS access key detected'
      },
      awsSecret: {
        regex: /(?:AWS|aws|Aws)?(?:SECRET|secret|Secret)?(?:ACCESS|access|Access)?(?:KEY|key|Key)?[\s]*[:=][\s]*['"]?([a-zA-Z0-9+/]{40})['"]?/g,
        reason: 'AWS secret key detected'
      },
      
      // Database
      dbPassword: {
        regex: /(?:database|db|mysql|postgres|postgresql|mongo|mongodb|redis)(?:_|-)?(?:password|pass|pwd)[\s]*[:=][\s]*['"]?([^'"\s]+)['"]?/gi,
        reason: 'Database password detected'
      },
      connectionString: {
        regex: /(?:connection[_-]?string|conn[_-]?str|database[_-]?url|db[_-]?url)[\s]*[:=][\s]*['"]?([^'"\s]+)['"]?/gi,
        reason: 'Database connection string detected'
      },
      
      // OAuth and JWT
      githubToken: {
        regex: /ghp_[a-zA-Z0-9]{36}/g,
        reason: 'GitHub personal access token detected'
      },
      jwtSecret: {
        regex: /(?:jwt[_-]?secret|jwt[_-]?key)[\s]*[:=][\s]*['"]?([^'"\s]{10,})['"]?/gi,
        reason: 'JWT secret detected'
      },
      oauthSecret: {
        regex: /(?:oauth[_-]?secret|client[_-]?secret)[\s]*[:=][\s]*['"]?([^'"\s]{10,})['"]?/gi,
        reason: 'OAuth secret detected'
      },
      
      // Passwords
      password: {
        regex: /(?:password|passwd|pwd)[\s]*[:=][\s]*['"]?(?!(?:true|false|null|undefined|placeholder|\*{3,}|<[^>]+>|process\.env))[^'"\s]{4,}['"]?/gi,
        reason: 'Password detected'
      },
      
      // Private Keys
      privateKey: {
        regex: /-----BEGIN (?:RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----/g,
        reason: 'Private key detected'
      },
      
      // Credit Cards
      creditCard: {
        regex: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
        reason: 'Credit card number pattern detected'
      },
      
      // Email credentials
      smtpPassword: {
        regex: /(?:smtp[_-]?password|mail[_-]?password|email[_-]?password)[\s]*[:=][\s]*['"]?([^'"\s]+)['"]?/gi,
        reason: 'Email password detected'
      },
      
      // Stripe
      stripeKey: {
        regex: /(?:sk|pk)_(?:test|live)_[a-zA-Z0-9]{24,}/g,
        reason: 'Stripe API key detected'
      },
      
      // Generic secrets
      secret: {
        regex: /(?:secret|private[_-]?key)[\s]*[:=][\s]*['"]?(?!(?:true|false|null|undefined|placeholder))[a-zA-Z0-9_\-]{10,}['"]?/gi,
        reason: 'Generic secret detected'
      }
    };
    
    // File patterns that commonly contain secrets
    this.sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.production',
      '.env.development',
      'config/secrets.yml',
      'config/database.yml',
      'secrets.json',
      'credentials.json',
      'keyfile.json',
      '.npmrc',
      '.netrc',
      '.git-credentials',
      'id_rsa',
      'id_dsa',
      'id_ecdsa',
      'id_ed25519',
      '.pem',
      '.key',
      '.p12',
      '.pfx'
    ];
    
    // Safe patterns to exclude (false positives)
    this.safePatterns = [
      /process\.env\./,
      /import\.meta\.env\./,
      /\$\{.*\}/,  // Template literals
      /\{\{.*\}\}/, // Handlebars/templating
      /<%= .* %>/, // ERB templates
      /placeholder/i,
      /example/i,
      /your[_-]?api[_-]?key/i,
      /\*{3,}/, // Multiple asterisks
      /^(?:true|false|null|undefined)$/i
    ];
  }

  async scan(files) {
    const sensitiveFiles = [];
    
    for (const file of files) {
      if (file.isDeleted) continue;
      
      try {
        // Check if filename itself is sensitive
        if (this.isSensitiveFileName(file.path)) {
          sensitiveFiles.push({
            path: file.path,
            reason: 'Sensitive file type',
            line: null,
            match: null
          });
          continue;
        }
        
        // Skip binary files
        if (await this.isBinaryFile(file.path)) {
          continue;
        }
        
        // Scan file contents
        const content = await fs.readFile(file.path, 'utf-8');
        const issues = this.scanContent(content, file.path);
        
        if (issues.length > 0) {
          sensitiveFiles.push(...issues);
        }
      } catch (error) {
        // File might not be readable or might not exist
        continue;
      }
    }
    
    return sensitiveFiles;
  }

  isSensitiveFileName(filePath) {
    const basename = path.basename(filePath);
    const lowerPath = filePath.toLowerCase();
    
    // Check exact matches
    if (this.sensitiveFiles.includes(basename)) {
      return true;
    }
    
    // Check extensions
    const ext = path.extname(basename);
    if (['.pem', '.key', '.p12', '.pfx', '.jks'].includes(ext)) {
      return true;
    }
    
    // Check patterns
    if (lowerPath.includes('secret') || 
        lowerPath.includes('credential') || 
        lowerPath.includes('private') ||
        lowerPath.includes('password')) {
      return true;
    }
    
    return false;
  }

  async isBinaryFile(filePath) {
    try {
      const buffer = await fs.readFile(filePath, { encoding: null, flag: 'r' });
      const slice = buffer.slice(0, 512);
      
      // Check for null bytes (common in binary files)
      for (let i = 0; i < slice.length; i++) {
        if (slice[i] === 0) {
          return true;
        }
      }
      
      // Check for high percentage of non-printable characters
      let nonPrintable = 0;
      for (let i = 0; i < slice.length; i++) {
        const byte = slice[i];
        if (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) {
          nonPrintable++;
        }
      }
      
      return nonPrintable / slice.length > 0.3;
    } catch {
      return false;
    }
  }

  scanContent(content, filePath) {
    const issues = [];
    const lines = content.split('\n');
    
    for (const [name, pattern] of Object.entries(this.patterns)) {
      const regex = new RegExp(pattern.regex);
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        // Check if this is a false positive
        if (this.isFalsePositive(match[0], match[1] || match[0])) {
          continue;
        }
        
        // Find line number
        const position = match.index;
        let lineNumber = 1;
        let charCount = 0;
        
        for (let i = 0; i < lines.length; i++) {
          charCount += lines[i].length + 1; // +1 for newline
          if (charCount > position) {
            lineNumber = i + 1;
            break;
          }
        }
        
        issues.push({
          path: filePath,
          reason: pattern.reason,
          line: lineNumber,
          match: this.sanitizeMatch(match[1] || match[0])
        });
      }
    }
    
    return issues;
  }

  isFalsePositive(fullMatch, value) {
    // Check if the value is too short to be real
    if (value && value.length < 6) {
      return true;
    }
    
    // Check safe patterns
    for (const safe of this.safePatterns) {
      if (safe.test(fullMatch)) {
        return true;
      }
    }
    
    // Check if it's a common placeholder value
    const lowerValue = value ? value.toLowerCase() : '';
    const placeholders = [
      'xxxxxxxx',
      'changeme',
      'replace_me',
      'your_key_here',
      'test123',
      'password123',
      'admin',
      'demo',
      'sample'
    ];
    
    if (placeholders.includes(lowerValue)) {
      return true;
    }
    
    // Check if it's all the same character (like 'aaaaaaa')
    if (value && value.length > 3 && new Set(value).size === 1) {
      return true;
    }
    
    return false;
  }

  sanitizeMatch(match) {
    // Show only first and last few characters of sensitive data
    if (match.length > 10) {
      const start = match.substring(0, 3);
      const end = match.substring(match.length - 3);
      return `${start}...${end}`;
    }
    return match.substring(0, 3) + '...';
  }
}

module.exports = new SensitiveDetector();