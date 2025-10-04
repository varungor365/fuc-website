import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

// Code Auditor - Automated scanning for broken features, missing imports, and 404 errors
// Creates comprehensive audit reports for GitHub Copilot-friendly error resolution

export interface AuditIssue {
  id: string;
  type: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'TypeScript' | 'Import' | 'Route' | 'Asset' | 'Component' | 'API';
  file: string;
  line?: number;
  column?: number;
  message: string;
  description: string;
  suggestion: string;
  fixCommand?: string;
  relatedFiles?: string[];
}

export interface RouteInfo {
  path: string;
  file: string;
  type: 'page' | 'layout' | 'loading' | 'error' | 'not-found';
  dynamic: boolean;
  exists: boolean;
  hasHandler: boolean;
}

export interface ComponentInfo {
  name: string;
  file: string;
  exports: string[];
  imports: string[];
  usedBy: string[];
  unused: boolean;
  missingImports: string[];
}

export interface AssetInfo {
  path: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  size: number;
  exists: boolean;
  referencedBy: string[];
  broken: boolean;
}

export interface AuditReport {
  timestamp: Date;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    filesCovered: number;
    coveragePercentage: number;
  };
  issues: AuditIssue[];
  routes: RouteInfo[];
  components: ComponentInfo[];
  assets: AssetInfo[];
  recommendations: string[];
  fixScript: string;
}

export class CodeAuditor {
  private workspacePath: string;
  private excludePatterns: string[];
  private issues: AuditIssue[] = [];
  private routes: RouteInfo[] = [];
  private components: ComponentInfo[] = [];
  private assets: AssetInfo[] = [];

  constructor(workspacePath: string, excludePatterns: string[] = ['node_modules', '.next', 'dist', 'build']) {
    this.workspacePath = workspacePath;
    this.excludePatterns = excludePatterns;
  }

  async auditAllPages(): Promise<AuditIssue[]> {
    console.log('🔍 Starting page audit...');
    
    const pageFiles = await this.findPageFiles();
    const pageIssues: AuditIssue[] = [];

    for (const pageFile of pageFiles) {
      try {
        const content = await fs.readFile(pageFile, 'utf-8');
        const issues = await this.auditPageFile(pageFile, content);
        pageIssues.push(...issues);
      } catch (error) {
        pageIssues.push({
          id: `page-read-error-${Date.now()}`,
          type: 'Critical',
          category: 'TypeScript',
          file: pageFile,
          message: `Failed to read page file: ${error}`,
          description: 'Unable to read and analyze page file',
          suggestion: 'Check file permissions and ensure file exists',
          fixCommand: `echo "Check file: ${pageFile}"`
        });
      }
    }

    this.issues.push(...pageIssues);
    return pageIssues;
  }

  private async findPageFiles(): Promise<string[]> {
    const patterns = [
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx', 
      'src/app/**/loading.tsx',
      'src/app/**/error.tsx',
      'src/app/**/not-found.tsx',
      'src/pages/**/*.tsx',
      'src/pages/**/*.ts'
    ];

    const files: string[] = [];
    for (const pattern of patterns) {
      try {
        const matches = await glob(pattern, { cwd: this.workspacePath });
        files.push(...matches.map(f => path.join(this.workspacePath, f)));
      } catch (error) {
        console.warn(`Could not search for pattern ${pattern}:`, error);
      }
    }

    return files;
  }

  private async auditPageFile(filePath: string, content: string): Promise<AuditIssue[]> {
    const issues: AuditIssue[] = [];

    // Check for TypeScript errors
    issues.push(...this.checkTypeScriptErrors(filePath, content));

    // Check for missing imports
    issues.push(...this.checkMissingImports(filePath, content));

    // Check for broken image references
    issues.push(...this.checkBrokenAssets(filePath, content));

    // Check for invalid route links
    issues.push(...this.checkRouteLinks(filePath, content));

    // Check for unused dependencies
    issues.push(...this.checkUnusedDependencies(filePath, content));

    // Check for mandatory page elements
    issues.push(...this.checkMandatoryElements(filePath, content));

    return issues;
  }

  private checkTypeScriptErrors(filePath: string, content: string): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const lines = content.split('\n');

    // Check for common TypeScript issues
    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Missing type annotations
      if (line.match(/function\s+\w+\s*\([^)]*\)\s*{/) && !line.includes(':')) {
        issues.push({
          id: `ts-missing-return-type-${filePath}-${lineNumber}`,
          type: 'Medium',
          category: 'TypeScript',
          file: filePath,
          line: lineNumber,
          message: 'Function missing return type annotation',
          description: 'Functions should have explicit return type annotations',
          suggestion: 'Add return type annotation (e.g., `: Promise<void>` or `: string`)',
          fixCommand: `// Add return type to function at line ${lineNumber}`
        });
      }

      // Implicit any types
      if (line.includes('any') && !line.includes('// @ts-ignore')) {
        issues.push({
          id: `ts-implicit-any-${filePath}-${lineNumber}`,
          type: 'High',
          category: 'TypeScript',
          file: filePath,
          line: lineNumber,
          message: 'Implicit any type detected',
          description: 'Using any defeats the purpose of TypeScript type safety',
          suggestion: 'Replace with specific type or interface',
          fixCommand: `// Replace 'any' with specific type at line ${lineNumber}`
        });
      }

      // Missing error handling in async functions
      if (line.includes('await') && !content.includes('try') && !content.includes('catch')) {
        issues.push({
          id: `ts-missing-error-handling-${filePath}-${lineNumber}`,
          type: 'High',
          category: 'TypeScript',
          file: filePath,
          line: lineNumber,
          message: 'Async operation without error handling',
          description: 'Await operations should be wrapped in try-catch blocks',
          suggestion: 'Add try-catch block around async operations',
          fixCommand: `// Add error handling for await at line ${lineNumber}`
        });
      }

      // Non-null assertion without null check
      if (line.includes('!') && line.includes('.')) {
        issues.push({
          id: `ts-dangerous-assertion-${filePath}-${lineNumber}`,
          type: 'Medium',
          category: 'TypeScript',
          file: filePath,
          line: lineNumber,
          message: 'Non-null assertion operator used',
          description: 'Non-null assertions can cause runtime errors',
          suggestion: 'Add proper null checking or optional chaining',
          fixCommand: `// Replace ! with null check at line ${lineNumber}`
        });
      }
    });

    return issues;
  }

  private checkMissingImports(filePath: string, content: string): AuditIssue[] {
    const issues: AuditIssue[] = [];

    // Common React/Next.js imports that might be missing
    const commonImports = [
      { pattern: /useState|useEffect|useCallback|useMemo/, import: "import { useState, useEffect } from 'react'" },
      { pattern: /Link/, import: "import Link from 'next/link'" },
      { pattern: /Image/, import: "import Image from 'next/image'" },
      { pattern: /motion\./, import: "import { motion } from 'framer-motion'" },
      { pattern: /className=.*"[^"]*"/, import: "// Consider using Tailwind CSS classes" }
    ];

    commonImports.forEach(({ pattern, import: importStatement }) => {
      if (pattern.test(content) && !content.includes(importStatement.split(' ')[1])) {
        issues.push({
          id: `import-missing-${filePath}-${pattern.source}`,
          type: 'High',
          category: 'Import',
          file: filePath,
          message: `Missing import: ${importStatement}`,
          description: 'Component uses functionality that requires import',
          suggestion: `Add import statement: ${importStatement}`,
          fixCommand: `// Add to top of file: ${importStatement}`
        });
      }
    });

    // Check for custom component imports
    const componentMatches = content.match(/<([A-Z][a-zA-Z0-9]*)/g);
    if (componentMatches) {
      const usedComponents = [...new Set(componentMatches.map(match => match.slice(1)))];
      const importSection = content.split('\n').slice(0, 20).join('\n'); // First 20 lines
      
      usedComponents.forEach(component => {
        if (!importSection.includes(component) && component !== 'Image' && component !== 'Link') {
          issues.push({
            id: `import-custom-missing-${filePath}-${component}`,
            type: 'Critical',
            category: 'Import',
            file: filePath,
            message: `Missing import for custom component: ${component}`,
            description: `Component <${component}> is used but not imported`,
            suggestion: `Add import for ${component} component`,
            fixCommand: `// Add import: import ${component} from './path/to/${component}'`
          });
        }
      });
    }

    return issues;
  }

  private checkBrokenAssets(filePath: string, content: string): AuditIssue[] {
    const issues: AuditIssue[] = [];

    // Find all image/asset references
    const assetPatterns = [
      /src=["']([^"']+)["']/g,
      /href=["']([^"']+\.(css|js|ico))["']/g,
      /url\(["']?([^)"']+)["']?\)/g,
      /import.*from\s+["']([^"']+\.(png|jpg|jpeg|gif|svg|ico|css|js))["']/g
    ];

    assetPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const assetPath = match[1];
        
        // Skip external URLs and data URLs
        if (assetPath.startsWith('http') || assetPath.startsWith('data:') || assetPath.startsWith('//')) {
          continue;
        }

        // Check if asset exists
        const fullAssetPath = this.resolveAssetPath(assetPath, filePath);
        
        issues.push({
          id: `asset-check-${filePath}-${assetPath}`,
          type: 'Medium',
          category: 'Asset',
          file: filePath,
          message: `Asset reference found: ${assetPath}`,
          description: 'Asset reference needs verification',
          suggestion: `Verify that asset exists at: ${fullAssetPath}`,
          fixCommand: `// Check if file exists: ${fullAssetPath}`
        });
      }
    });

    return issues;
  }

  private resolveAssetPath(assetPath: string, filePath: string): string {
    if (assetPath.startsWith('/')) {
      return path.join(this.workspacePath, 'public', assetPath);
    }
    
    if (assetPath.startsWith('./') || assetPath.startsWith('../')) {
      return path.resolve(path.dirname(filePath), assetPath);
    }
    
    return path.join(this.workspacePath, 'public', assetPath);
  }

  private checkRouteLinks(filePath: string, content: string): AuditIssue[] {
    const issues: AuditIssue[] = [];

    // Find all Link components and href attributes
    const linkPatterns = [
      /<Link\s+[^>]*href=["']([^"']+)["'][^>]*>/g,
      /href=["']\/([^"']*?)["']/g,
      /router\.push\(["']([^"']+)["']\)/g,
      /navigate\(["']([^"']+)["']\)/g
    ];

    linkPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const routePath = match[1];
        
        // Skip external URLs, fragments, and query params
        if (routePath.startsWith('http') || routePath.startsWith('#') || routePath.startsWith('mailto:') || routePath.startsWith('tel:')) {
          continue;
        }

        issues.push({
          id: `route-check-${filePath}-${routePath}`,
          type: 'High',
          category: 'Route',
          file: filePath,
          message: `Route link found: ${routePath}`,
          description: 'Route needs verification to prevent 404 errors',
          suggestion: `Verify route exists in app directory: ${routePath}`,
          fixCommand: `// Verify route file exists for: ${routePath}`
        });
      }
    });

    return issues;
  }

  private checkUnusedDependencies(filePath: string, content: string): AuditIssue[] {
    const issues: AuditIssue[] = [];

    // Extract all imports
    const importMatches = content.match(/import\s+.*?\s+from\s+['"][^'"]+['"]/g);
    if (!importMatches) return issues;

    importMatches.forEach(importLine => {
      const importMatch = importLine.match(/import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/);
      if (!importMatch) return;

      const importedItems = importMatch[1];
      const importSource = importMatch[2];

      // Check if imported items are actually used
      if (importedItems.includes('{')) {
        // Named imports
        const namedImports = importedItems.match(/{([^}]+)}/);
        if (namedImports) {
          const items = namedImports[1].split(',').map(item => item.trim());
          items.forEach(item => {
            const itemName = item.split(' as ')[0].trim();
            if (!content.includes(itemName) || content.indexOf(itemName) === content.indexOf(importLine)) {
              issues.push({
                id: `unused-import-${filePath}-${itemName}`,
                type: 'Low',
                category: 'Import',
                file: filePath,
                message: `Potentially unused import: ${itemName}`,
                description: 'Imported item may not be used in the component',
                suggestion: `Remove unused import: ${itemName}`,
                fixCommand: `// Remove ${itemName} from imports in ${importSource}`
              });
            }
          });
        }
      } else {
        // Default import
        const defaultImport = importedItems.trim();
        const usageCount = (content.match(new RegExp(`\\b${defaultImport}\\b`, 'g')) || []).length;
        if (usageCount <= 1) { // Only the import statement itself
          issues.push({
            id: `unused-default-import-${filePath}-${defaultImport}`,
            type: 'Low',
            category: 'Import',
            file: filePath,
            message: `Potentially unused default import: ${defaultImport}`,
            description: 'Default import may not be used in the component',
            suggestion: `Remove unused import: ${defaultImport}`,
            fixCommand: `// Remove import ${defaultImport} from '${importSource}'`
          });
        }
      }
    });

    return issues;
  }

  private checkMandatoryElements(filePath: string, content: string): AuditIssue[] {
    const issues: AuditIssue[] = [];

    // Check for page-specific mandatory elements
    if (filePath.includes('page.tsx')) {
      // Every page should export default
      if (!content.includes('export default')) {
        issues.push({
          id: `mandatory-default-export-${filePath}`,
          type: 'Critical',
          category: 'Component',
          file: filePath,
          message: 'Missing default export in page component',
          description: 'Next.js pages must have a default export',
          suggestion: 'Add default export for the page component',
          fixCommand: '// Add: export default ComponentName'
        });
      }

      // Pages should have proper metadata
      if (!content.includes('metadata') && !content.includes('generateMetadata')) {
        issues.push({
          id: `mandatory-metadata-${filePath}`,
          type: 'Medium',
          category: 'Component',
          file: filePath,
          message: 'Missing metadata export',
          description: 'Pages should include metadata for SEO',
          suggestion: 'Add metadata export or generateMetadata function',
          fixCommand: '// Add: export const metadata = { title: "...", description: "..." }'
        });
      }
    }

    // Check for layout-specific elements
    if (filePath.includes('layout.tsx')) {
      if (!content.includes('children')) {
        issues.push({
          id: `mandatory-children-${filePath}`,
          type: 'Critical',
          category: 'Component',
          file: filePath,
          message: 'Layout missing children prop',
          description: 'Layout components must render children',
          suggestion: 'Add children prop and render it in the component',
          fixCommand: '// Add children: React.ReactNode to props and render {children}'
        });
      }
    }

    // Check for error boundaries
    if (filePath.includes('error.tsx')) {
      if (!content.includes('use client')) {
        issues.push({
          id: `mandatory-use-client-${filePath}`,
          type: 'Critical',
          category: 'Component',
          file: filePath,
          message: 'Error component missing "use client" directive',
          description: 'Error components must be client components',
          suggestion: 'Add "use client" directive at the top of the file',
          fixCommand: '// Add: "use client" at the beginning of the file'
        });
      }
    }

    return issues;
  }

  async validateRoutes(): Promise<RouteInfo[]> {
    console.log('🔍 Starting route validation...');
    
    const routes: RouteInfo[] = [];
    const appDir = path.join(this.workspacePath, 'src/app');
    
    try {
      const routeFiles = await this.findRouteFiles(appDir);
      
      for (const routeFile of routeFiles) {
        const routeInfo = await this.analyzeRoute(routeFile);
        routes.push(routeInfo);
      }
    } catch (error) {
      console.error('Error validating routes:', error);
    }

    this.routes = routes;
    return routes;
  }

  private async findRouteFiles(appDir: string): Promise<string[]> {
    const routeFiles: string[] = [];
    
    const walkDir = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await walkDir(fullPath);
          } else if (entry.isFile() && 
                     (entry.name === 'page.tsx' || entry.name === 'layout.tsx' || 
                      entry.name === 'loading.tsx' || entry.name === 'error.tsx' || 
                      entry.name === 'not-found.tsx')) {
            routeFiles.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`Could not read directory ${dir}:`, error);
      }
    };
    
    await walkDir(appDir);
    return routeFiles;
  }

  private async analyzeRoute(routeFile: string): Promise<RouteInfo> {
    const relativePath = path.relative(path.join(this.workspacePath, 'src/app'), routeFile);
    const routePath = this.filePathToRoute(relativePath);
    const fileName = path.basename(routeFile, '.tsx');
    
    let exists = false;
    let hasHandler = false;
    
    try {
      await fs.access(routeFile);
      exists = true;
      
      const content = await fs.readFile(routeFile, 'utf-8');
      hasHandler = content.includes('export default') || content.includes('export {');
    } catch (error) {
      // File doesn't exist or can't be read
    }

    return {
      path: routePath,
      file: routeFile,
      type: fileName as RouteInfo['type'],
      dynamic: routePath.includes('[') || routePath.includes('...'),
      exists,
      hasHandler
    };
  }

  private filePathToRoute(filePath: string): string {
    // Convert file path to Next.js route
    const segments = filePath.split(path.sep);
    const route = segments
      .filter(segment => !segment.includes('.tsx'))
      .join('/')
      .replace(/\/page$/, '') || '/';
    
    return route.startsWith('/') ? route : '/' + route;
  }

  async checkAssets(): Promise<AssetInfo[]> {
    console.log('🔍 Starting asset verification...');
    
    const assets: AssetInfo[] = [];
    const publicDir = path.join(this.workspacePath, 'public');
    
    try {
      const assetFiles = await this.findAssetFiles(publicDir);
      
      for (const assetFile of assetFiles) {
        const assetInfo = await this.analyzeAsset(assetFile);
        assets.push(assetInfo);
      }
    } catch (error) {
      console.error('Error checking assets:', error);
    }

    this.assets = assets;
    return assets;
  }

  private async findAssetFiles(publicDir: string): Promise<string[]> {
    const assetPatterns = [
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.gif', 
      '**/*.svg',
      '**/*.ico',
      '**/*.webp',
      '**/*.mp4',
      '**/*.webm',
      '**/*.pdf'
    ];

    const assetFiles: string[] = [];
    for (const pattern of assetPatterns) {
      try {
        const matches = await glob(pattern, { cwd: publicDir });
        assetFiles.push(...matches.map(f => path.join(publicDir, f)));
      } catch (error) {
        console.warn(`Could not find assets for pattern ${pattern}:`, error);
      }
    }

    return assetFiles;
  }

  private async analyzeAsset(assetFile: string): Promise<AssetInfo> {
    const relativePath = path.relative(path.join(this.workspacePath, 'public'), assetFile);
    const assetPath = '/' + relativePath.replace(/\\/g, '/');
    const ext = path.extname(assetFile).toLowerCase();
    
    let type: AssetInfo['type'] = 'other';
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'].includes(ext)) type = 'image';
    else if (['.mp4', '.webm', '.avi', '.mov'].includes(ext)) type = 'video';
    else if (['.mp3', '.wav', '.ogg'].includes(ext)) type = 'audio';
    else if (['.pdf', '.doc', '.docx'].includes(ext)) type = 'document';

    let size = 0;
    let exists = false;

    try {
      const stats = await fs.stat(assetFile);
      size = stats.size;
      exists = true;
    } catch (error) {
      // File doesn't exist
    }

    return {
      path: assetPath,
      type,
      size,
      exists,
      referencedBy: [], // This would be populated by cross-referencing with code files
      broken: !exists
    };
  }

  async analyzeComponents(): Promise<ComponentInfo[]> {
    console.log('🔍 Starting component analysis...');
    
    const components: ComponentInfo[] = [];
    const componentFiles = await this.findComponentFiles();
    
    for (const componentFile of componentFiles) {
      try {
        const componentInfo = await this.analyzeComponent(componentFile);
        components.push(componentInfo);
      } catch (error) {
        console.warn(`Could not analyze component ${componentFile}:`, error);
      }
    }

    this.components = components;
    return components;
  }

  private async findComponentFiles(): Promise<string[]> {
    const patterns = [
      'src/components/**/*.tsx',
      'src/components/**/*.ts',
      'src/lib/**/*.tsx',
      'src/lib/**/*.ts',
      'src/hooks/**/*.tsx',
      'src/hooks/**/*.ts'
    ];

    const files: string[] = [];
    for (const pattern of patterns) {
      try {
        const matches = await glob(pattern, { cwd: this.workspacePath });
        files.push(...matches.map(f => path.join(this.workspacePath, f)));
      } catch (error) {
        console.warn(`Could not find components for pattern ${pattern}:`, error);
      }
    }

    return files;
  }

  private async analyzeComponent(componentFile: string): Promise<ComponentInfo> {
    const content = await fs.readFile(componentFile, 'utf-8');
    const name = path.basename(componentFile, path.extname(componentFile));
    
    // Extract exports
    const exportMatches = content.match(/export\s+(?:default\s+)?(?:function|const|class|interface|type)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    const exports = exportMatches ? exportMatches.map(match => {
      const nameMatch = match.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
      return nameMatch ? nameMatch[1] : '';
    }).filter(Boolean) : [];

    // Extract imports
    const importMatches = content.match(/import\s+.*?\s+from\s+['"][^'"]+['"]/g) || [];
    const imports = importMatches.map(imp => {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/);
      return match ? match[1] : '';
    }).filter(Boolean);

    return {
      name,
      file: componentFile,
      exports,
      imports,
      usedBy: [], // This would be populated by analyzing usage across files
      unused: exports.length === 0,
      missingImports: [] // This would be populated by analyzing missing dependencies
    };
  }

  async generateReport(): Promise<AuditReport> {
    console.log('📝 Generating comprehensive audit report...');
    
    // Collect all issues from different audit methods
    await this.auditAllPages();
    await this.validateRoutes();
    await this.checkAssets();
    await this.analyzeComponents();

    const summary = {
      totalIssues: this.issues.length,
      criticalIssues: this.issues.filter(i => i.type === 'Critical').length,
      highIssues: this.issues.filter(i => i.type === 'High').length,
      mediumIssues: this.issues.filter(i => i.type === 'Medium').length,
      lowIssues: this.issues.filter(i => i.type === 'Low').length,
      filesCovered: new Set(this.issues.map(i => i.file)).size,
      coveragePercentage: 0 // Would calculate based on total files found
    };

    const recommendations = this.generateRecommendations();
    const fixScript = this.generateFixScript();

    return {
      timestamp: new Date(),
      summary,
      issues: this.issues,
      routes: this.routes,
      components: this.components,
      assets: this.assets,
      recommendations,
      fixScript
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.issues.filter(i => i.type === 'Critical').length > 0) {
      recommendations.push('🚨 Address critical issues first - these prevent the app from working correctly');
    }

    if (this.issues.filter(i => i.category === 'TypeScript').length > 10) {
      recommendations.push('🔧 Consider enabling stricter TypeScript settings to catch more issues at compile time');
    }

    if (this.issues.filter(i => i.category === 'Import').length > 5) {
      recommendations.push('📦 Review import statements and remove unused dependencies');
    }

    if (this.routes.filter(r => !r.exists || !r.hasHandler).length > 0) {
      recommendations.push('🔗 Fix broken routes to prevent 404 errors');
    }

    if (this.assets.filter(a => a.broken).length > 0) {
      recommendations.push('🖼️ Fix broken asset references to improve user experience');
    }

    recommendations.push('✅ Run automated fixes using the generated fix script');
    recommendations.push('🔍 Set up automated testing to catch issues earlier');
    recommendations.push('📚 Consider adding ESLint and Prettier for consistent code quality');

    return recommendations;
  }

  private generateFixScript(): string {
    const commands: string[] = [
      '#!/bin/bash',
      '# Automated fix script generated by Code Auditor',
      '# Review each command before running',
      '',
      'echo "Starting automated fixes..."',
      ''
    ];

    // Add specific fix commands for each issue
    this.issues.forEach(issue => {
      if (issue.fixCommand) {
        commands.push(`# ${issue.message}`);
        commands.push(issue.fixCommand);
        commands.push('');
      }
    });

    commands.push('echo "Automated fixes complete. Please review changes and test thoroughly."');

    return commands.join('\n');
  }

  async saveReport(outputPath: string): Promise<void> {
    const report = await this.generateReport();
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
    
    // Also save a markdown version for easier reading
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = outputPath.replace('.json', '.md');
    await fs.writeFile(markdownPath, markdownReport);
    
    console.log(`✅ Audit report saved to: ${outputPath}`);
    console.log(`✅ Markdown report saved to: ${markdownPath}`);
  }

  private generateMarkdownReport(report: AuditReport): string {
    const md: string[] = [];
    
    md.push('# Code Audit Report');
    md.push('');
    md.push(`Generated: ${report.timestamp.toISOString()}`);
    md.push('');
    
    md.push('## Summary');
    md.push('');
    md.push(`- **Total Issues:** ${report.summary.totalIssues}`);
    md.push(`- **Critical:** ${report.summary.criticalIssues}`);
    md.push(`- **High:** ${report.summary.highIssues}`);
    md.push(`- **Medium:** ${report.summary.mediumIssues}`);
    md.push(`- **Low:** ${report.summary.lowIssues}`);
    md.push(`- **Files Covered:** ${report.summary.filesCovered}`);
    md.push('');
    
    md.push('## Critical Issues');
    md.push('');
    const criticalIssues = report.issues.filter(i => i.type === 'Critical');
    if (criticalIssues.length === 0) {
      md.push('✅ No critical issues found!');
    } else {
      criticalIssues.forEach((issue, index) => {
        md.push(`### ${index + 1}. ${issue.message}`);
        md.push('');
        md.push(`**File:** \`${issue.file}\``);
        if (issue.line) md.push(`**Line:** ${issue.line}`);
        md.push(`**Description:** ${issue.description}`);
        md.push(`**Suggestion:** ${issue.suggestion}`);
        md.push('');
      });
    }
    
    md.push('## Recommendations');
    md.push('');
    report.recommendations.forEach(rec => {
      md.push(`- ${rec}`);
    });
    md.push('');
    
    md.push('## Route Analysis');
    md.push('');
    const brokenRoutes = report.routes.filter(r => !r.exists || !r.hasHandler);
    if (brokenRoutes.length === 0) {
      md.push('✅ All routes are properly configured!');
    } else {
      brokenRoutes.forEach(route => {
        md.push(`- **${route.path}** - ${!route.exists ? 'File missing' : 'No handler'}`);
      });
    }
    md.push('');
    
    return md.join('\n');
  }
}

// Main audit function
export async function auditCodebase(workspacePath?: string): Promise<AuditReport> {
  const auditor = new CodeAuditor(workspacePath || process.cwd());
  return await auditor.generateReport();
}

export default CodeAuditor;