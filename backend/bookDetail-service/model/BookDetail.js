const mongoose = require('mongoose');

const bookDetailSchema = new mongoose.Schema({
    edition: { type: String }, 
    pages: { type: Number },
    language: { type: String },
    stock_quantity: { type: Number, default: 0, min: 0 },
    dimensions: { type: String },
    weight: { type: Number },
    publication_year: { type: Number },
    cover_type: { type: String, enum: ['bìa mềm', 'bìa cứng'], default: 'bìa mềm' },
    volume: { type: Number },
    isbn: { type: String, unique: true, required: true }, 
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    images: [{ type: String }],
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BookDetail', bookDetailSchema);
