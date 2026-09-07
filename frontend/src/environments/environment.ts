export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  // Dev: media-library images and uploads are served by the local upload
  // server on port 3001.
  mediaBaseUrl: 'http://localhost:3001',
  uploadApiUrl: 'http://localhost:3001/api/upload',
  supabase: {
    url: 'https://api.nouvelage.clinic',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.9HEnzqvt60ZjFENKXBRFZvol6UYVoXr0v_6OAY0yF8g'
  }
};
