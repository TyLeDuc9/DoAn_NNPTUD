    const mongoose = require('mongoose');
    const slugify = require('slugify');

    const bookSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            unique: true 
        },
        description:{
            type:String
        },
        category_id: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: true
            }
        ],
        author_id: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Author',
                required: true
            }
        ],
        publisher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publisher',
            required: true
        },

    }, { timestamps: true });

    // Middleware tự động tạo slug từ name
    bookSchema.pre('save', function (next) {
        if (this.isModified('name')) {
            this.slug = slugify(this.name, { lower: true, strict: true });
        }
        next();
    });

    module.exports = mongoose.model('Book', bookSchema);
