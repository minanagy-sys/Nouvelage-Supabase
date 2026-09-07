export const environment = {
  production: true,
  // Same-origin in production: nginx proxies /api to the Node API and serves
  // /assets directly, so no host prefixes are needed.
  apiUrl: '/api',
  mediaBaseUrl: '',
  siteUrl: 'https://www.nouvelage.clinic'
};
