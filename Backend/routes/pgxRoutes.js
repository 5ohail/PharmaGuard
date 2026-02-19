const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const analysisController = require('../controllers/analysisController');

/**
 * Configure Multer for File Uploads
 * Files are temporarily stored in the /uploads folder
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generates a unique name: timestamp-originalname.vcf
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

// Filter to ensure only .vcf files are uploaded
const fileFilter = (req, file, cb) => {
  const filetypes = /vcf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Only .vcf files are allowed!'));
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * @route   POST /api/v1/analyze
 * @desc    Upload VCF and get PGx analysis
 * @access  Public (or protected via Auth middleware)
 */
router.post('/analyze', upload.single('vcf'), analysisController.analyze);

module.exports = router;