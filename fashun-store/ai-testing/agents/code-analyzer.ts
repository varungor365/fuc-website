import { AnalysisReport, CodeIssue, FixSuggestion } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class CodeAnalysisAgent {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  async initialize() {
    try {
      console.log('Code Analysis Agent initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Code Analysis Agent:', error);
      return false;
    }
  }

  async analyzeFile(filePath: string): Promise<AnalysisReport> {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      
      const issues: CodeIssue[] = [];
      const suggestions: FixSuggestion[] = [];
      
      // Check for common issues
      this.checkForSecurityIssues(fileContent, issues, suggestions);
      this.checkForPerformanceIssues(fileContent, issues, suggestions);
      this.checkForCodeSmells(fileContent, issues, suggestions);
      
      const severity = this.calculateSeverity(issues);
      
      return {
        filePath,
        issues,
        severity,
        suggestions
      };
    } catch (error) {
      return {
        filePath,
        issues: [{
          type: 'bug',
          line: 0,
          column: 0,
          message: `Failed to analyze file: ${error.message}`
        }],
        severity: 'high',
        suggestions: []
      };
    }
  }

  async analyzeDirectory(dirPath: string): Promise<AnalysisReport[]> {
    const reports: AnalysisReport[] = [];
    const fullPath = path.join(this.projectRoot, dirPath);
    
    try {
      const files = fs.readdirSync(fullPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fullFilePath = path.join(fullPath, file);
        
        const stats = fs.statSync(fullFilePath);
        
        if (stats.isDirectory()) {
          // Recursively analyze subdirectories
          const subReports = await this.analyzeDirectory(filePath);
          reports.push(...subReports);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          // Analyze TypeScript/JavaScript files
          const report = await this.analyzeFile(filePath);
          reports.push(report);
        }
      }
    } catch (error) {
      console.error(`Error analyzing directory ${dirPath}:`, error);
    }
    
    return reports;
  }

  private checkForSecurityIssues(content: string, issues: CodeIssue[], suggestions: FixSuggestion[]): void {
    // Check for common security issues
    if (content.includes('eval(')) {
      issues.push({
        type: 'security',
        line: this.getLineNumberOfSubstring(content, 'eval('),
        column: 0,
        message: 'Use of eval() function detected - potential security risk'
      });
      
      suggestions.push({
        issueId: 'security-eval',
        description: 'Replace eval() with safer alternatives like JSON.parse() or Function constructor',
        codeChange: 'Use JSON.parse() for JSON data or create a function with the Function constructor',
        confidence: 0.9
      });
    }
    
    if (content.includes('innerHTML') && content.includes('=')) {
      issues.push({
        type: 'security',
        line: this.getLineNumberOfSubstring(content, 'innerHTML'),
        column: 0,
        message: 'Direct assignment to innerHTML detected - potential XSS vulnerability'
      });
      
      suggestions.push({
        issueId: 'security-innerhtml',
        description: 'Use textContent for plain text or sanitize HTML before assignment',
        codeChange: 'Replace innerHTML assignment with textContent or use a sanitization library',
        confidence: 0.8
      });
    }
  }

  private checkForPerformanceIssues(content: string, issues: CodeIssue[], suggestions: FixSuggestion[]): void {
    // Check for common performance issues
    if (content.includes('addEventListener') && content.includes('scroll')) {
      issues.push({
        type: 'performance',
        line: this.getLineNumberOfSubstring(content, 'scroll'),
        column: 0,
        message: 'Scroll event listener detected without throttling - potential performance issue'
      });
      
      suggestions.push({
        issueId: 'performance-scroll',
        description: 'Add throttling or debouncing to scroll event listeners',
        codeChange: 'Implement throttling using requestAnimationFrame or lodash.throttle',
        confidence: 0.85
      });
    }
  }

  private checkForCodeSmells(content: string, issues: CodeIssue[], suggestions: FixSuggestion[]): void {
    // Check for common code smells
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > 200) {
        issues.push({
          type: 'code-smell',
          line: i + 1,
          column: 0,
          message: 'Long line detected - consider breaking into smaller lines for readability'
        });
      }
    }
    
    // Check for TODO comments
    if (content.includes('TODO:')) {
      issues.push({
        type: 'code-smell',
        line: this.getLineNumberOfSubstring(content, 'TODO:'),
        column: 0,
        message: 'TODO comment found - consider addressing or creating a task'
      });
    }
  }

  private calculateSeverity(issues: CodeIssue[]): 'low' | 'medium' | 'high' | 'critical' {
    if (issues.some(issue => issue.type === 'security')) return 'critical';
    if (issues.some(issue => issue.type === 'bug')) return 'high';
    if (issues.some(issue => issue.type === 'performance')) return 'medium';
    return 'low';
  }

  private getLineNumberOfSubstring(content: string, substring: string): number {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(substring)) {
        return i + 1;
      }
    }
    return 0;
  }

  async generateReport(reports: AnalysisReport[]): Promise<string> {
    let report = '# Code Analysis Report\n\n';
    report += `Generated at: ${new Date().toISOString()}\n\n`;
    
    const totalIssues = reports.reduce((sum, report) => sum + report.issues.length, 0);
    report += `Total Issues Found: ${totalIssues}\n\n`;
    
    // Group issues by severity
    const criticalIssues = reports.filter(report => report.severity === 'critical');
    const highIssues = reports.filter(report => report.severity === 'high');
    const mediumIssues = reports.filter(report => report.severity === 'medium');
    const lowIssues = reports.filter(report => report.severity === 'low');
    
    if (criticalIssues.length > 0) {
      report += '## Critical Issues\n\n';
      for (const reportItem of criticalIssues) {
        report += `### ${reportItem.filePath}\n`;
        for (const issue of reportItem.issues) {
          if (issue.type === 'security') {
            report += `- **Security Issue** (Line ${issue.line}): ${issue.message}\n`;
          }
        }
        report += '\n';
      }
    }
    
    if (highIssues.length > 0) {
      report += '## High Priority Issues\n\n';
      for (const reportItem of highIssues) {
        report += `### ${reportItem.filePath}\n`;
        for (const issue of reportItem.issues) {
          if (issue.type === 'bug') {
            report += `- **Bug** (Line ${issue.line}): ${issue.message}\n`;
          }
        }
        report += '\n';
      }
    }
    
    if (mediumIssues.length > 0) {
      report += '## Medium Priority Issues\n\n';
      for (const reportItem of mediumIssues) {
        report += `### ${reportItem.filePath}\n`;
        for (const issue of reportItem.issues) {
          if (issue.type === 'performance') {
            report += `- **Performance Issue** (Line ${issue.line}): ${issue.message}\n`;
          }
        }
        report += '\n';
      }
    }
    
    if (lowIssues.length > 0) {
      report += '## Low Priority Issues\n\n';
      for (const reportItem of lowIssues) {
        report += `### ${reportItem.filePath}\n`;
        for (const issue of reportItem.issues) {
          if (issue.type === 'code-smell') {
            report += `- **Code Smell** (Line ${issue.line}): ${issue.message}\n`;
          }
        }
        report += '\n';
      }
    }
    
    return report;
  }
}