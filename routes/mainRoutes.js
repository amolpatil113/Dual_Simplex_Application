const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.renderHome);
router.get('/simulate', pageController.renderSimulate);
router.get('/results', pageController.renderResults);

module.exports = router;
