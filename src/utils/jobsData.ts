
export type JobStatus = 'success' | 'failed' | 'running' | 'queued' | 'canceled';

export interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  errorMessage?: string;
}

export interface TestJob {
  id: string;
  name: string;
  status: JobStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  testCount: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  testResults: TestResult[];
}

// Generate a random unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 12);
};

// Sample initial jobs data
export const initialJobs: TestJob[] = [
  {
    id: 'job-1',
    name: 'API Integration Tests',
    status: 'success',
    startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 27).toISOString(),
    duration: 180000,
    testCount: 24,
    passedTests: 24,
    failedTests: 0,
    skippedTests: 0,
    testResults: [
      { id: 'test-1', name: 'User Authentication', status: 'passed', duration: 300 },
      { id: 'test-2', name: 'Data Retrieval', status: 'passed', duration: 450 },
      { id: 'test-3', name: 'Error Handling', status: 'passed', duration: 200 },
    ]
  },
  {
    id: 'job-2',
    name: 'UI Component Tests',
    status: 'failed',
    startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    duration: 300000,
    testCount: 15,
    passedTests: 12,
    failedTests: 3,
    skippedTests: 0,
    testResults: [
      { id: 'test-4', name: 'Button Rendering', status: 'passed', duration: 150 },
      { id: 'test-5', name: 'Modal Interactions', status: 'failed', duration: 220, errorMessage: 'Expected modal to be closed after action' },
      { id: 'test-6', name: 'Form Validation', status: 'passed', duration: 190 },
    ]
  },
  {
    id: 'job-3',
    name: 'Security Validation Suite',
    status: 'running',
    startTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    testCount: 30,
    passedTests: 20,
    failedTests: 0,
    skippedTests: 0,
    testResults: [
      { id: 'test-7', name: 'Input Sanitization', status: 'passed', duration: 380 },
      { id: 'test-8', name: 'CSRF Protection', status: 'passed', duration: 420 },
    ]
  },
  {
    id: 'job-4',
    name: 'Performance Benchmarks',
    status: 'queued',
    startTime: new Date(Date.now()).toISOString(),
    testCount: 8,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    testResults: []
  }
];

// Simulate creating a new job
export const createJob = (name: string): TestJob => {
  return {
    id: `job-${generateId()}`,
    name,
    status: 'queued',
    startTime: new Date().toISOString(),
    testCount: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    testResults: []
  };
};

// Format time duration in a human-readable format
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

// Get a formatted time string showing how long ago
export const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec} seconds ago`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minutes ago`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hours ago`;
  
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} days ago`;
};

// Get a color based on the job status
export const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case 'success':
      return 'bg-success text-success-foreground';
    case 'failed':
      return 'bg-error text-error-foreground';
    case 'running':
      return 'bg-primary text-primary-foreground';
    case 'queued':
      return 'bg-muted text-muted-foreground';
    case 'canceled':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

// Get a color based on the test result status
export const getTestResultColor = (status: TestResult['status']): string => {
  switch (status) {
    case 'passed':
      return 'text-success';
    case 'failed':
      return 'text-error';
    case 'skipped':
      return 'text-muted-foreground';
    default:
      return 'text-foreground';
  }
};
