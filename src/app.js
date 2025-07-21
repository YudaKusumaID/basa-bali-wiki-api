require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Impor rute
const wordRoutes = require('./api/routes/word.routes');
const indexRoutes = require('./api/routes/index.routes');
const ApiError = require('./utils/ApiError');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rute dokumentasi
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Selamat datang di Basa Bali Wiki API',
        endpoints: {
            getWordDetail: '/api/v1/kata/{nama_kata}',
            getWordIndexByLetter: '/api/v1/indeks/{huruf_awal}',
            getAllWordIndices: '/api/v1/indeks'
        }
    });
});

// Mounting router
app.use('/api/v1/kata', wordRoutes);
app.use('/api/v1/indeks', indexRoutes);

// Middleware untuk menangani rute yang tidak ditemukan
app.use((req, res, next) => {
    next(new ApiError(404, 'Endpoint tidak ditemukan'));
});

// Middleware penanganan error global
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Terjadi kesalahan pada server';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
});