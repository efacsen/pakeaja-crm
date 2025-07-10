#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// Role mappings from old to new
const roleMappings: Record<string, string> = {
  'superadmin': 'admin',
  'sales_rep': 'sales',
  'sales_manager': 'manager',
  'customer': 'client',
};

// Files to exclude
const excludePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.next/**',
  '**/auth-compat.ts', // Don't modify the compatibility layer itself
  '**/fix-role-references.ts', // Don't modify this script
];

function replaceRoleReferences(content: string): { updated: string; changes: number } {
  let updated = content;
  let changes = 0;

  // Replace role comparisons (e.g., role === 'superadmin')
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

    // Replace in arrays
    const arrayRegex = new RegExp(`(['"\`])${oldRole}(['"\`])`, 'g');
    const arrayMatches = updated.match(arrayRegex) || [];
    updated = updated.replace(arrayRegex, `$1${newRole}$2`);
    changes += arrayMatches.length;

    // Replace in object keys
    const objectKeyRegex = new RegExp(`^(\\s*)${oldRole}(\\s*:)`, 'gm');
    const objectKeyMatches = updated.match(objectKeyRegex) || [];
    updated = updated.replace(objectKeyRegex, `$1${newRole}$2`);
    changes += objectKeyMatches.length;
  });

  // Update imports from old auth to rbac
  const importRegex = /from ['"]@\/types\/auth['"]/g;
  if (importRegex.test(updated) && !updated.includes('auth-compat')) {
    updated = updated.replace(importRegex, `from '@/types/rbac'`);
    changes++;
  }

  return { updated, changes };
}

async function processFile(filePath: string): Promise<boolean> {
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
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔍 Searching for files with old role references...\n');

  // Find all TypeScript/JavaScript files
  const patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
  let allFiles: string[] = [];

  for (const pattern of patterns) {
    const files = glob.sync(pattern, {
      ignore: excludePatterns,
      nodir: true,
    });
    allFiles = allFiles.concat(files);
  }

  console.log(`Found ${allFiles.length} files to check\n`);

  let updatedCount = 0;
  for (const file of allFiles) {
    if (await processFile(file)) {
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
main().catch(console.error);