const express = require('express');
const { getWordDefinition } = require('../../controllers/word.controller');

const router = express.Router();

// GET /api/v1/kata/:nama
router.get('/:nama', getWordDefinition);

module.exports = router;