/**
 * Kelas kustom untuk menangani error operasional yang dapat diprediksi.
 * @extends Error
 */
class ApiError extends Error {
    /**
     * @param {number} statusCode Kode status HTTP untuk error ini.
     * @param {string} message Pesan error yang akan dikirim ke client.
     */
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;