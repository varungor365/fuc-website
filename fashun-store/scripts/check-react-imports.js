#!/usr/bin/env node

/**
 * React Import Standardization Script
 * Comment 11 Fix: Standardize all React imports to use "import React from 'react'"
 * 
 * This script identifies files with inconsistent React import patterns and suggests fixes.
 * Run this script to audit React imports across the project.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Standard React import pattern (Next.js 13+ with React 18+)
const PREFERRED_PATTERN = "import React from 'react'";
const ALTERNATIVE_PATTERNS = [
  /^import \* as React from ['"]react['"];?$/m,
  /^import React, \{.*\} from ['"]react['"];?$/m
];

// File patterns to check
const FILE_PATTERNS = [
  'src/**/*.tsx',
  'src/**/*.ts',
  '!src/**/*.d.ts',
  '!node_modules/**/*'
];

async function analyzeReactImports() {
  console.log('🔍 Analyzing React import patterns...\n');
  
  const issues = [];
  
  // Find all TypeScript/React files
  const files = glob.sync(FILE_PATTERNS.join('|'), { 
    cwd: process.cwd(),
    ignore: ['node_modules/**/*', '**/*.d.ts']
  });
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Skip files that don't import React
      if (!content.includes('from \'react\'') && !content.includes('from "react"')) {
        continue;
      }
      
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for non-standard React imports
        if (line.includes('from \'react\'') || line.includes('from "react"')) {
          // Check if it's already the preferred pattern
          if (line === PREFERRED_PATTERN || 
              line === PREFERRED_PATTERN + ';') {
            continue;
          }
          
          // Check for specific imports that should be combined
          const importMatch = line.match(/^import (.+) from ['"]react['"];?$/);
          if (importMatch) {
            const importContent = importMatch[1].trim();
            
            // Handle different patterns
            if (importContent === '* as React') {
              issues.push({
                file,
                line: i + 1,
                current: line,
                suggested: PREFERRED_PATTERN + (line.endsWith(';') ? ';' : ''),
                reason: 'Use default import instead of namespace import'
              });
            } else if (importContent.startsWith('React, {')) {
              // This is actually fine for hooks, but check if React is used
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error.message);
    }
  }
  
  // Report findings
  if (issues.length === 0) {
    console.log('✅ All React imports are consistent!\n');
    return;
  }
  
  console.log(`❌ Found ${issues.length} React import inconsistencies:\n`);
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.file}:${issue.line}`);
    console.log(`   Current: ${issue.current}`);
    console.log(`   Suggested: ${issue.suggested}`);
    console.log(`   Reason: ${issue.reason}\n`);
  });
  
  // Generate fix script
  console.log('📝 To fix these issues automatically, run:');
  console.log('   npm run fix-react-imports\n');
  
  return issues;
}

// Generate fix suggestions
function generateFixScript(issues) {
  console.log('#!/bin/bash');
  console.log('# Auto-generated React import fixes\n');
  
  issues.forEach(issue => {
    const escapedCurrent = issue.current.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const escapedSuggested = issue.suggested.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    console.log(`# Fix ${issue.file}:${issue.line}`);
    console.log(`sed -i 's/${escapedCurrent}/${escapedSuggested}/g' "${issue.file}"`);
    console.log('');
  });
}

if (require.main === module) {
  analyzeReactImports()
    .then(issues => {
      if (issues && issues.length > 0) {
        console.log('\n--- Fix Script ---');
        generateFixScript(issues);
      }
    })
    .catch(console.error);
}

module.exports = { analyzeReactImports, generateFixScript };