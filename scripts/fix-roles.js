#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Role mappings from old to new
const roleMappings = {
  'superadmin': 'admin',
  'sales_rep': 'sales',
  'sales_manager': 'manager',
  'customer': 'client',
};

// Files to exclude
const excludePatterns = [
  'node_modules',
  'dist',
  '.next',
  'auth-compat',
  'fix-roles.js',
  'fix-role-references.ts'
];

function shouldExclude(filePath) {
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

function replaceRoleReferences(content) {
  let updated = content;
  let changes = 0;

  // Replace role comparisons
  Object.entries(roleMappings).forEach(([oldRole, newRole]) => {
    // Replace in equality checks
    const equalityRegex = new RegExp(`(role\\s*[!=]==?\\s*['"\`])${oldRole}(['"\`])`, 'g');
    const equalityMatches = updated.match(equalityRegex) || [];
    updated = updated.replace(equalityRegex, `$1${newRole}$2`);
    changes += equalityMatches.length;

    // Replace in case statements
    const caseRegex = new RegExp(`(case\\s+['"\`])${oldRole}(['"\`])`, 'g');
    const caseMatches = updated.match(caseRegex) || [];
    updated = updated.replace(caseRegex, `$1${newRole}$2`);
    changes += caseMatches.length;

    // Replace in arrays and string literals
    const arrayRegex = new RegExp(`(['"\`])${oldRole}(['"\`])`, 'g');
    const arrayMatches = updated.match(arrayRegex) || [];
    updated = updated.replace(arrayRegex, `$1${newRole}$2`);
    changes += arrayMatches.length;

    // Replace in object keys (at start of line)
    const objectKeyRegex = new RegExp(`^(\\s*)${oldRole}(\\s*:)`, 'gm');
    const objectKeyMatches = updated.match(objectKeyRegex) || [];
    updated = updated.replace(objectKeyRegex, `$1${newRole}$2`);
    changes += objectKeyMatches.length;
  });

  return { updated, changes };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { updated, changes } = replaceRoleReferences(content);

    if (changes > 0) {
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log(`✅ Updated ${filePath} (${changes} changes)`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findFiles(dir, extensions, files = []) {
  if (shouldExclude(dir)) return files;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findFiles(fullPath, extensions, files);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext) && !shouldExclude(fullPath)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return files;
}

function main() {
  console.log('🔍 Searching for files with old role references...\n');

  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  const files = findFiles('.', extensions);

  console.log(`Found ${files.length} files to check\n`);

  let updatedCount = 0;
  for (const file of files) {
    if (processFile(file)) {
      updatedCount++;
    }
  }

  console.log(`\n✨ Completed! Updated ${updatedCount} files.`);
  
  if (updatedCount > 0) {
    console.log('\nNext steps:');
    console.log('1. Run "npm run build" to check for remaining TypeScript errors');
    console.log('2. Test the application to ensure everything works correctly');
    console.log('3. Commit the changes');
  }
}

// Run the script
main();