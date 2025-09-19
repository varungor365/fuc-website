module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/admin/overview',
      handler: 'admin-dashboard.getOverview',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};