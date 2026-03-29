const Author = require('../model/Author');

// CREATE
exports.createAuthor = async (req, res) => {
    try {
        const { name, address, bio } = req.body; 

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Vui lòng nhập tên' });
        }

        const author = new Author({ name, address, bio });
        const saved = await author.save();

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// GET ALL (có phân trang)
exports.getAllAuthor = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const sort = req.query.sort || "newest";

        const searchFilter = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        const sortOption =
            sort === "oldest"
                ? { createdAt: 1 }
                : { createdAt: -1 };

        const total = await Author.countDocuments(searchFilter);
        const authors = await Author.find(searchFilter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.json({
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            authors
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// GET BY ID
exports.getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
        res.json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE
exports.updateAuthor = async (req, res) => {
    try {
        const { name, bio, address } = req.body;

        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });

        if (name !== undefined) author.name = name;
        if (bio !== undefined) author.bio = bio;
        if (address !== undefined) author.address = address;

        const updated = await author.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE
exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
        res.json({ message: 'Xóa tác giả thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
    