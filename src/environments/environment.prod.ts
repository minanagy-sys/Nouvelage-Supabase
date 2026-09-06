export const environment = {
  production: true,
  apiUrl: 'https://api.nouvelage.com/api',
  // Same-origin in production: nginx serves /assets and proxies /api/upload
  // to the local upload server, so no host prefix is needed.
  mediaBaseUrl: '',
  uploadApiUrl: '/api/upload',
  supabase: {
    url: 'https://api.nouvelage.clinic',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.9HEnzqvt60ZjFENKXBRFZvol6UYVoXr0v_6OAY0yF8g'
  }
};
