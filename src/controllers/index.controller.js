const {
    scrapeWordListByLetter,
    scrapeAllWordLists,
} = require('../services/scraper.service');
const ApiError = require('../utils/ApiError');

async function getWordListByLetter(req, res, next) {
    try {
        const { huruf } = req.params;

        if (!huruf || huruf.length !== 1 || !/^[a-zA-Z]$/.test(huruf)) {
            throw new ApiError(400, 'Parameter "huruf" harus satu karakter alfabet.');
        }

        const words = await scrapeWordListByLetter(huruf);

        res.status(200).json({
            success: true,
            message: `Daftar kata untuk huruf '${huruf.toUpperCase()}' berhasil diambil.`,
            data: {
                letter: huruf.toUpperCase(),
                count: words.length,
                words,
            },
        });
    } catch (error) {
        next(error);
    }
}

async function getAllWords(req, res, next) {
    try {
        const allWords = await scrapeAllWordLists();

        res.status(200).json({
            success: true,
            message: `Semua daftar kata (indeks A-Z) berhasil diambil.`,
            data: {
                count: allWords.length,
                words: allWords,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getWordListByLetter,
    getAllWords,
};