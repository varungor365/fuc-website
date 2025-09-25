module.exports = {
  'graphql': {
    enabled: true,
    config: {
      // GraphQL endpoint
      endpoint: '/graphql',
      // GraphQL playground
      playgroundAlways: true,
      // Disable introspection in production
      introspection: process.env.NODE_ENV !== 'production',
      // Enable CORS
      cors: {
        enabled: true,
        headers: ['Content-Type', 'Authorization'],
      },
      // Disable certain mutations if needed
      // disabledPlugins: ['users-permissions'],
    }
  },
  
  // Configure users-permissions for profile management
  'users-permissions': {
    enabled: true,
    config: {
      // JWT configuration
      jwt: {
        expiresIn: '7d',
      },
      // Registration settings
      register: {
        allowedFields: ['username', 'email', 'firstName', 'lastName', 'profilePicture'],
      },
    },
  },

  // Upload plugin for profile pictures
  'upload': {
    enabled: true,
    config: {
      // File size limit: 10MB
      sizeLimit: 10 * 1024 * 1024,
      // Allowed file types
      provider: 'local',
      providerOptions: {
        localServer: {
          maxage: 300000
        }
      }
    }
  }
};