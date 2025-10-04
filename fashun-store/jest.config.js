/**
 * Jest Configuration for Comprehensive Testing
 * Covers unit, integration, and performance testing
 */

const config = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/setup/jest.setup.ts',
    '<rootDir>/src/tests/setup/testing-library.setup.ts'
  ],
  
  // Module resolution
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/tests/(.*)$': '<rootDir>/src/tests/$1',
    // Static assets
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
  },
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/tests/**/*',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
    '!src/pages/api/**/*'
  ],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  
  // Module file extensions
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json'
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Projects for different test types
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '<rootDir>/src/**/__tests__/unit/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.unit.{test,spec}.{js,jsx,ts,tsx}'
      ],
      setupFilesAfterEnv: [
        '<rootDir>/src/tests/setup/jest.setup.ts'
      ]
    },
    {
      displayName: 'integration',
      testMatch: [
        '<rootDir>/src/**/__tests__/integration/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.integration.{test,spec}.{js,jsx,ts,tsx}'
      ],
      setupFilesAfterEnv: [
        '<rootDir>/src/tests/setup/jest.setup.ts',
        '<rootDir>/src/tests/setup/integration.setup.ts'
      ]
    },
    {
      displayName: 'performance',
      testMatch: [
        '<rootDir>/src/**/__tests__/performance/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.performance.{test,spec}.{js,jsx,ts,tsx}'
      ],
      setupFilesAfterEnv: [
        '<rootDir>/src/tests/setup/jest.setup.ts',
        '<rootDir>/src/tests/setup/performance.setup.ts'
      ]
    }
  ],
  
  // Global setup and teardown
  globalSetup: '<rootDir>/src/tests/setup/global.setup.ts',
  globalTeardown: '<rootDir>/src/tests/setup/global.teardown.ts',
  
  // Custom test results processor
  testResultsProcessor: '<rootDir>/src/tests/utils/test-results-processor.ts',
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Error on deprecated features
  errorOnDeprecated: true,
  
  // Fail tests on console errors (in CI)
  ...(process.env.CI && {
    setupFilesAfterEnv: [
      '<rootDir>/src/tests/setup/jest.setup.ts',
      '<rootDir>/src/tests/setup/ci.setup.ts'
    ]
  })
};

module.exports = config;