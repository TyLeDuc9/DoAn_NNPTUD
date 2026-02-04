const Category = require('../model/Category')
const slugify = require('slugify');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Vui lòng nhập tên' });
        }

        const exists = await Category.findOne({ name: name.trim() });
        if (exists) {
            return res.status(400).json({ message: 'Danh mục đã có sẵn' });
        }

        const category = new Category({ name: name.trim() });
        const saved = await category.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Category.countDocuments();
        const categories = await Category.find()
            .skip(skip)
            .limit(limit)
        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            categories
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Vui lòng nhập tên' });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        if (name.trim() !== category.name) {
            const exists = await Category.findOne({ name: name.trim() });
            if (exists) {
                return res.status(400).json({ message: 'Danh mục đã sẵn' });
            }
        }

        category.name = name.trim();
        category.slug = slugify(name.trim(), { lower: true, strict: true });

        const updated = await category.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Category.findByIdAndDelete(id)
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy danh mục' })
        res.json({ message: 'Xóa thành công danh mục' })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}