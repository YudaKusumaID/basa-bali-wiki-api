const express = require('express');
const {
    getWordListByLetter,
    getAllWords,
} = require('../../controllers/index.controller');

const router = express.Router();

// GET /api/v1/indeks
router.get('/', getAllWords);

// GET /api/v1/indeks/:huruf
router.get('/:huruf', getWordListByLetter);

module.exports = router;