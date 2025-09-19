/**
 * Jest Setup - Global test configuration with proper TypeScript support
 */

import 'whatwg-fetch';

// Extend global types for Jest
declare global {
  var testUtils: {
    mockApiResponse: (data: any, status?: number) => void;
    mockApiError: (status?: number, message?: string) => void;
    resetAllMocks: () => void;
    waitFor: (ms: number) => Promise<void>;
    createMockUser: () => any;
    createMockProduct: () => any;
    createMockOrder: () => any;
  };
}

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    pop: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = (props: any) => {
    return React.createElement('img', props);
  };
  MockImage.displayName = 'MockImage';
  return {
    __esModule: true,
    default: MockImage,
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, ...props }: any) => {
    return React.createElement('a', props, children);
  };
  MockLink.displayName = 'MockLink';
  return {
    __esModule: true,
    default: MockLink,
  };
});

// Mock Next.js Head component
jest.mock('next/head', () => {
  const MockHead = ({ children }: any) => {
    return children;
  };
  MockHead.displayName = 'MockHead';
  return {
    __esModule: true,
    default: MockHead,
  };
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Web APIs
Object.defineProperty(window, 'performance', {
  value: {
    ...window.performance,
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn().mockReturnValue([]),
    getEntriesByType: jest.fn().mockReturnValue([]),
    now: jest.fn(() => Date.now()),
    timing: {
      navigationStart: 0,
      loadEventEnd: 1000,
    },
    memory: {
      usedJSHeapSize: 1024 * 1024 * 10, // 10MB
      jsHeapSizeLimit: 1024 * 1024 * 100, // 100MB
    },
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => '12345678-1234-1234-1234-123456789012'),
    getRandomValues: jest.fn((arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    subtle: {
      digest: jest.fn(),
      encrypt: jest.fn(),
      decrypt: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
    },
  },
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    headers: new Headers(),
    redirected: false,
    type: 'basic',
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
  } as Response)
);

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1, // OPEN
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  onopen: null,
  onclose: null,
  onmessage: null,
  onerror: null,
}));

// Mock MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn().mockReturnValue([]),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock gtag (Google Analytics)
(global as any).gtag = jest.fn();

// Mock process.env for tests
process.env.NODE_ENV = 'test';

// Global test utilities
global.testUtils = {
  // Mock API responses
  mockApiResponse: (data: any, status = 200) => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    });
  },

  // Mock API error
  mockApiError: (status = 500, message = 'Internal Server Error') => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(message));
  },

  // Reset all mocks
  resetAllMocks: () => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.clear.mockClear();
  },

  // Wait for async operations
  waitFor: (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)),

  // Create mock user
  createMockUser: () => ({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
  }),

  // Create mock product
  createMockProduct: () => ({
    id: 'product-123',
    name: 'Test Product',
    description: 'A test product for testing',
    price: 99.99,
    currency: 'USD',
    images: ['https://example.com/product.jpg'],
    category: 'Test Category',
    brand: 'Test Brand',
    sku: 'TEST-SKU-123',
    stock: 10,
    isAvailable: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
  }),

  // Create mock order
  createMockOrder: () => ({
    id: 'order-123',
    userId: 'user-123',
    items: [
      {
        productId: 'product-123',
        quantity: 2,
        price: 99.99,
      },
    ],
    total: 199.98,
    currency: 'USD',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

// Console suppression for cleaner test output
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Clean up after each test
afterEach(() => {
  global.testUtils.resetAllMocks();
  jest.clearAllTimers();
});

export {};