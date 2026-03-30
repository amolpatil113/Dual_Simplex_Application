const express = require('express');
const router = express.Router();
const optimizeController = require('../controllers/optimizeController');

router.post('/optimize', optimizeController.postOptimize);

module.exports = router;
