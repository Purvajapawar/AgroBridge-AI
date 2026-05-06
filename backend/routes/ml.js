const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');

// Use memory storage so we can forward buffers to ML service without writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

const ML_SERVICE_FALLBACK_URL = 'https://agrobridge-ml-66im.onrender.com';

const getMlServiceUrl = () => {
  return process.env.ML_SERVICE_URL || ML_SERVICE_FALLBACK_URL;
};

// POST /api/ml/predict-price
router.post('/predict-price', async (req, res) => {
  try {
    const { cropType, expectedPrice, location } = req.body || {};

    if (!cropType || expectedPrice === undefined || expectedPrice === null) {
      return res.status(400).json({ success: false, message: 'cropType and expectedPrice are required' });
    }

    const mlUrl = getMlServiceUrl();

    const mlResponse = await axios.post(
      `${mlUrl}/predict-price`,
      {
        cropType,
        expectedPrice: typeof expectedPrice === 'string' ? parseInt(expectedPrice, 10) : expectedPrice,
        location: location || ''
      },
      { timeout: 10000 }
    );

    const data = mlResponse.data;

    return res.json({
      success: data?.success ?? true,
      predicted_price: data?.predicted_price ?? data?.predictedPrice,
      suggested_price: data?.suggested_price ?? data?.suggestedPrice,
      recommendation: data?.recommendation,
      diff: data?.diff,
      confidence: data?.confidence,
      source: 'ml_service'
    });
  } catch (error) {
    console.error('ML predict-price error:', error?.response?.data || error?.message || error);
    return res.status(502).json({ success: false, message: 'ML service unavailable for predict-price' });
  }
});

// POST /api/ml/detect-quality
// Expects multipart/form-data with field name: file
router.post('/detect-quality', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded (field name: file)' });
    }

    const mlUrl = getMlServiceUrl();

    const formData = new (require('form-data'))();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname || 'upload.jpg',
      contentType: req.file.mimetype || 'image/jpeg'
    });

    const mlResponse = await axios.post(`${mlUrl}/detect-quality`, formData, {
      headers: formData.getHeaders(),
      timeout: 20000
    });

    const data = mlResponse.data;
    return res.json({
      success: data?.success ?? true,
      grade: data?.grade,
      broken_percentage: data?.broken_percentage,
      color_score: data?.color_score,
      confidence: data?.confidence,
      source: 'ml_service'
    });
  } catch (error) {
    console.error('ML detect-quality error:', error?.response?.data || error?.message || error);
    return res.status(502).json({ success: false, message: 'ML service unavailable for detect-quality' });
  }
});

// POST /api/ml/predict-product
// Expects multipart/form-data with field name: file
router.post('/predict-product', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded (field name: file)' });
    }

    const mlUrl = getMlServiceUrl();

    const formData = new (require('form-data'))();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname || 'upload.jpg',
      contentType: req.file.mimetype || 'image/jpeg'
    });

    const mlResponse = await axios.post(`${mlUrl}/predict-product`, formData, {
      headers: formData.getHeaders(),
      timeout: 20000
    });

    const data = mlResponse.data;
    return res.json({
      success: data?.success ?? true,
      product: data?.product,
      confidence: data?.confidence,
      source: 'ml_service'
    });
  } catch (error) {
    console.error('ML predict-product error:', error?.response?.data || error?.message || error);
    return res.status(502).json({ success: false, message: 'ML service unavailable for predict-product' });
  }
});

module.exports = router;

