const { scrapeWordDefinition } = require('../services/scraper.service');
const ApiError = require('../utils/ApiError');

async function getWordDefinition(req, res, next) {
    try {
        const { nama } = req.params;
        if (!nama) {
            throw new ApiError(400, 'Parameter "nama" kata diperlukan.');
        }

        const data = await scrapeWordDefinition(nama);

        res.status(200).json({
            success: true,
            message: `Definisi untuk kata '${nama}' berhasil diambil.`,
            data,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getWordDefinition,
};