const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for the Angular app. In production the site is served on the
// same origin (nginx proxies /api/upload to this server), so these entries
// mainly cover local dev and any direct cross-origin calls.
const allowedOrigins = [
  'http://localhost:4200',
  'https://www.nouvelage.clinic',
  'https://nouvelage.clinic'
];
app.use(cors({
  origin: (origin, callback) => {
    // allow same-origin/non-browser (no origin) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  }
}));

app.use(express.json());

// Serve uploaded files statically so they're immediately accessible
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Temporary storage
const upload = multer({ dest: 'temp/' });

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadPath = req.body.uploadPath || 'public/assets/img/uploads';
    const filename = req.body.filename || req.file.originalname;
    const fullPath = path.join(__dirname, uploadPath);

    // Create directory if it doesn't exist
    fs.mkdirSync(fullPath, { recursive: true });

    // Move file from temp to final destination
    const finalPath = path.join(fullPath, filename);
    fs.renameSync(req.file.path, finalPath);

    const webPath = (uploadPath + '/' + filename).replace('public/', '/');

    console.log('✅ File uploaded successfully:');
    console.log('   Local path:', finalPath);
    console.log('   Web path:', webPath);

    res.json({
      success: true,
      path: webPath,
      localPath: finalPath,
      filename: filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Upload server is running' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Upload server running on http://localhost:${PORT}`);
  console.log(`📁 Ready to receive file uploads from Angular app\n`);
});
