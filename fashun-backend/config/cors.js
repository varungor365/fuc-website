module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        'https://www.fashun.co.in',
        'https://fashun.co.in',
        'https://p.fashun.co.in',
        'http://localhost:3000',
        'http://localhost:3001'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
  },
};
