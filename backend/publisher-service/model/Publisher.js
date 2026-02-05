const mongoose = require('mongoose');
const slugify = require('slugify');

const publisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        match: /^[0-9]{10,11}$/
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 30,
        unique: true
    },
    image: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        unique: true
    }
}, { timestamps: true });

// Tạo slug tự động từ name trước khi lưu
publisherSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Publisher', publisherSchema);
