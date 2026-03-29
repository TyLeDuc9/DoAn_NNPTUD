const mongoose = require('mongoose')
const slugify = require('slugify');
const Publisher = require('../model/Publisher')
exports.updatePublisher = async (req, res) => {
    try {
        const { name, email, address, phone } = req.body;
        const image = req.file ? req.file.path : null;

        const publisher = await Publisher.findById(req.params.id);
        if (!publisher) return res.status(404).json({ message: 'Không tìm thấy NXB' });

        if (name) {
            publisher.name = name;
            publisher.slug = slugify(name, { lower: true, strict: true }); 
        }
        if (address) publisher.address = address;
        if (email) publisher.email = email;
        if (phone) publisher.phone = phone;
        if (image) publisher.image = image;

        const updated = await publisher.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.createPublisher = async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !address || !phone || !email) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const publisher = new Publisher({ name, address, phone, email, image });
    const saved = await publisher.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email này đã tồn tại!" });
    }
    console.error("Error createPublisher:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getAllPublisher = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const sort = req.query.sort || "newest";

        const searchFilter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const sortOption =
            sort === "oldest"
                ? { createdAt: 1 }
                : { createdAt: -1 };

        const total = await Publisher.countDocuments(searchFilter);
        const publishers = await Publisher.find(searchFilter)
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
            publishers
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getPublisherById = async (req, res) => {
    try {
        const publisher = await Publisher.findById(req.params.id)
        if (!publisher) return res.status(404).json({ message: 'Không tìm thấy NXB' })
        res.json(publisher)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deletePublisher = async (req, res) => {
    try {
        const publisher = await Publisher.findByIdAndDelete(req.params.id);
        if (!publisher) return res.status(404).json({ message: 'Không tìm thấy NXB' });
        res.json({ message: 'Xóa NXB thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}