const axios = require('axios');
const cheerio = require('cheerio');
const ApiError = require('../utils/ApiError');

const BASE_URL = 'https://dictionary.basabali.org';

/**
 * Melakukan scraping detail definisi untuk satu kata.
 * @param {string} word - Kata yang akan dicari.
 * @returns {Promise<object>} Objek berisi detail kata.
 */
async function scrapeWordDefinition(word) {
    try {
        const url = `${BASE_URL}/${encodeURIComponent(word)}`;
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        if ($('div.noarticletext').length > 0 || $('h1.firstHeading').text().includes('This page does not exist')) {
            throw new ApiError(404, `Kata '${word}' tidak ditemukan di kamus.`);
        }

        const scrapedData = {
            word: $('h1.firstHeading').text().trim(),
            definitions: [],
            speechLevels: [],
            dialects: [],
            examples: [],
        };

        $('div.bali-word__block:contains("Definitions") div.bali-word__text ul li').each((i, el) => {
            const fullText = $(el).text().trim().replace(/\s\s+/g, ' ');
            const lang = $(el).find('span.language-badge').text().trim();
            const text = fullText.replace(lang, '').trim();
            scrapedData.definitions.push({ lang, text });
        });

        $('div.bali-gray:contains("Level of Speech Option") div.bali-item').each((i, el) => {
            const level = $(el).find('div.bali-item__left').clone().children().remove().end().text().trim();
            const text = $(el).find('div.bali-item__right').text().trim();
            scrapedData.speechLevels.push({ level, text });
        });

        $('div.bali-gray:contains("Dialects") div.bali-item').each((i, el) => {
            const dialect = $(el).find('div.bali-item__left').text().trim();
            const text = $(el).find('div.bali-item__right').text().trim();
            scrapedData.dialects.push({ dialect, text });
        });

        $('div.bali-gray:contains("Sentences Example") div.bali-item-group').each((i, el) => {
            const example = {};
            $(el).find('div.bali-item').each((j, item) => {
                const lang = $(item).find('div.bali-item__left').text().trim().toLowerCase();
                const sentence = $(item).find('div.bali-item__right').text().trim();
                if (lang && sentence) example[lang] = sentence;
            });
            if (Object.keys(example).length > 0) scrapedData.examples.push(example);
        });

        return scrapedData;

    } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error.response && error.response.status === 404) {
            throw new ApiError(404, `Kata '${word}' tidak ditemukan di kamus.`);
        }
        console.error('Scraping definition error:', error.message);
        throw new ApiError(500, 'Gagal melakukan scraping ke situs sumber untuk detail kata.');
    }
}

/**
 * Melakukan scraping daftar kata berdasarkan huruf awal.
 * @param {string} letter - Huruf awal (A-Z).
 * @returns {Promise<string[]>} Array kata-kata.
 */
async function scrapeWordListByLetter(letter) {
    const upperCaseLetter = letter.toUpperCase();
    const url = `${BASE_URL}/w/index.php?title=Special:RunQuery&form=DictionaryIndex&DictionaryIndex%5BLetter%5D=${upperCaseLetter}&_run=1`;

    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        const wordListContainer = $('div.word-block-list');

        if (wordListContainer.length === 0) return [];

        const words = [];
        wordListContainer.find('a').each((i, el) => {
            words.push($(el).text().trim());
        });
        return words;

    } catch (error) {
        console.error(`Gagal scraping daftar kata untuk huruf '${upperCaseLetter}':`, error.message);
        throw new ApiError(500, `Gagal mengambil daftar kata untuk huruf '${upperCaseLetter}'.`);
    }
}

/**
 * Melakukan scraping semua daftar kata dari A sampai Z secara bersamaan.
 * @returns {Promise<string[]>} Array gabungan semua kata.
 */
async function scrapeAllWordLists() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    console.log('Memulai scraping semua daftar kata dari A-Z...');

    const promises = alphabet.map(letter => scrapeWordListByLetter(letter));

    try {
        const results = await Promise.all(promises);
        const allWords = results.flat();
        console.log(`Scraping selesai. Total ${allWords.length} kata ditemukan.`);
        return allWords;

    } catch (error) {
        console.error('Terjadi kesalahan saat scraping semua daftar kata:', error.message);
        throw new ApiError(503, 'Gagal mengambil sebagian atau seluruh data dari situs sumber.');
    }
}

module.exports = {
    scrapeWordDefinition,
    scrapeWordListByLetter,
    scrapeAllWordLists,
};