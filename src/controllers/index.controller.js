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

        let page = parseInt(req.query.page, 10) || 1;
        const limitParam = req.query.limit;

        const returnAll = !limitParam ||
            limitParam.toString().toLowerCase() === 'all' ||
            limitParam === '';

        let limit = returnAll ? null : parseInt(limitParam, 10) || 20;

        if (!returnAll) {
            if (page < 1) page = 1;
            if (limit < 1) limit = 1;
            if (limit > 100) limit = 100;
        } else {
            page = 1;
        }

        const allWordsForLetter = await scrapeWordListByLetter(huruf);
        const totalWords = allWordsForLetter.length;

        let paginatedWords;
        let responseMetadata;

        if (returnAll) {
            paginatedWords = allWordsForLetter;
            responseMetadata = {
                mode: 'all',
                totalItems: totalWords,
                itemsReturned: totalWords
            };
        } else {
            const totalPages = Math.ceil(totalWords / limit);

            if (page > totalPages && totalPages > 0) {
                page = totalPages;
            }

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            paginatedWords = allWordsForLetter.slice(startIndex, endIndex);

            responseMetadata = {
                mode: 'paginated',
                currentPage: page,
                totalPages: totalPages,
                limit: limit,
                totalItems: totalWords,
                itemsOnPage: paginatedWords.length,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            };
        }

        res.status(200).json({
            success: true,
            message: `Daftar kata untuk huruf '${huruf.toUpperCase()}' berhasil diambil.`,
            pagination: responseMetadata,
            data: paginatedWords,
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