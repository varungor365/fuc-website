// ai-testing/types.ts
export interface TestResults {
  passed: boolean;
  failedTests: TestCase[];
  warnings: string[];
  suggestions: string[];
  timestamp: Date;
}

export interface TestCase {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  error?: string;
  screenshot?: string;
  timestamp: Date;
}

export interface AccessibilityReport {
  violations: any[];
  passes: any[];
  incomplete: any[];
  timestamp: Date;
}

export interface PerformanceReport {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timestamp: Date;
}

export interface VisualTestResults {
  differences: any[];
  baselineScreenshots: any[];
  currentScreenshots: any[];
  timestamp: Date;
}

export interface APITestResults {
  endpoints: EndpointTest[];
  overallStatus: 'passed' | 'failed' | 'partial';
  recommendations: string[];
}

export interface EndpointTest {
  endpoint: string;
  method: string;
  status: 'passed' | 'failed' | 'warning';
  responseTime: number;
  error?: string;
}

export interface SecurityReport {
  vulnerabilities: SecurityVulnerability[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface SecurityVulnerability {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  fix?: string;
}

export interface AnalysisReport {
  filePath: string;
  issues: CodeIssue[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestions: FixSuggestion[];
}

export interface CodeIssue {
  type: 'bug' | 'security' | 'performance' | 'accessibility' | 'code-smell';
  line: number;
  column: number;
  message: string;
  suggestion?: string;
}

export interface FixSuggestion {
  issueId: string;
  description: string;
  codeChange: string;
  confidence: number; // 0-1 scale
}

export interface FixResult {
  success: boolean;
  changesApplied: number;
  filesModified: string[];
  errors: string[];
  backupCreated: boolean;
}

export interface RefactorResult {
  originalCode: string;
  refactoredCode: string;
  improvements: string[];
  breakingChanges: boolean;
}