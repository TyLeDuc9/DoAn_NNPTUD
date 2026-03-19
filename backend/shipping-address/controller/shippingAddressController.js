const mongoose = require("mongoose");
const User = mongoose.model('User', require('../../user-service/model/User').schema);
const ShippingAddress = require("../model/ShippingAddress");
exports.getAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra id có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID địa chỉ không hợp lệ" });
    }

    const address = await ShippingAddress.findById(id);

    if (!address) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    res.status(200).json({
      success: true,
      address
    });
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ theo ID:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi lấy địa chỉ",
      error: error.message
    });
  }
};
exports.adminUpdateAddress = async (req, res) => {
  try {
    const { id } = req.params; // id địa chỉ cần cập nhật
    const { fullName, phone, address, city, district, ward } = req.body;

    // Cập nhật địa chỉ mà không thay đổi is_default
    const updatedAddress = await ShippingAddress.findByIdAndUpdate(
      id,
      { fullName, phone, address, city, district, ward },
      { new: true } // trả về bản ghi sau khi cập nhật
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật địa chỉ thành công",
      address: updatedAddress
    });
  } catch (error) {
    console.error("Lỗi khi admin cập nhật địa chỉ:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi cập nhật địa chỉ",
      error: error.message
    });
  }
};
exports.getAddressesGroupedByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOption = req.query.sort || "newest";
    const sortOrder = sortOption === "oldest" ? 1 : -1; // ✅ thêm dòng này

    const totalUsers = await ShippingAddress.distinct("userId").then(users => users.length);
    const totalPages = Math.ceil(totalUsers / limit);

    const grouped = await ShippingAddress.aggregate([
      { $sort: { createdAt: sortOrder } }, // sắp xếp địa chỉ trước khi group
      {
        $group: {
          _id: "$userId",
          addresses: { $push: "$$ROOT" },
          count: { $sum: 1 },
          latestCreatedAt: { $max: "$createdAt" } // thêm field để sort user
        },
      },
      { $sort: { latestCreatedAt: sortOrder } }, // sắp xếp các user
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          count: 1,
          addresses: 1,
          user: {
            _id: "$userInfo._id",
            name: "$userInfo.name",
            email: "$userInfo.email",
            role: "$userInfo.role"
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      count: grouped.length,
      users: grouped,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages
      }
    });

  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi lấy danh sách địa chỉ.",
      error: error.message
    });
  }
};



// 🟢 [GET] Lấy tất cả địa chỉ giao hàng của 1 user
exports.getAllAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await ShippingAddress.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ is_default: -1, createdAt: -1 });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách địa chỉ",
      error: error.message,
    });
  }
};

// 🟢 [POST] Thêm địa chỉ mới
exports.createAddress = async (req, res) => {
  try {
    const { userId, fullName, phone, address, city, district, ward, is_default } = req.body;

    // Nếu người dùng chọn địa chỉ mặc định, bỏ chọn các địa chỉ mặc định khác
    if (is_default) {
      await ShippingAddress.updateMany({ userId }, { $set: { is_default: false } });
    }

    const newAddress = new ShippingAddress({
      userId,
      fullName,
      phone,
      address,
      city,
      district,
      ward,
      is_default,
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm địa chỉ mới", error: error.message });
  }
};

// 🟢 [PUT] Cập nhật địa chỉ
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, city, district, ward, is_default, userId } = req.body;

    if (is_default) {
      await ShippingAddress.updateMany({ userId }, { $set: { is_default: false } });
    }

    const updatedAddress = await ShippingAddress.findByIdAndUpdate(
      id,
      { fullName,  phone, address, city, district, ward, is_default },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật địa chỉ", error: error.message });
  }
};

// 🟢 [DELETE] Xóa địa chỉ
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ShippingAddress.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ để xóa" });
    }
    res.status(200).json({ message: "Xóa địa chỉ thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa địa chỉ", error: error.message });
  }
};

// 🟢 [PATCH] Chọn địa chỉ mặc định
exports.setDefaultAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;

    await ShippingAddress.updateMany({ userId }, { $set: { is_default: false } });

    const updated = await ShippingAddress.findByIdAndUpdate(
      addressId,
      { is_default: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Địa chỉ không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật địa chỉ mặc định thành công", updated });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đặt địa chỉ mặc định", error: error.message });
  }
};
