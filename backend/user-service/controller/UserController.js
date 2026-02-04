const User = require('../model/User')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS   
  }
});
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ trường" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Xác nhận mật khẩu không đúng" });
    }

    // Tìm user theo token hợp lệ (còn hạn)
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại' });
    }
    const userName = user.name || user.email;

    // Tạo token
    const token = crypto.randomBytes(32).toString("hex");

    // Lưu token vào DB
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    // Link reset gửi FE
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Khôi phục mật khẩu",
      html: `
      <h3>Yêu cầu đặt lại mật khẩu</h3>
      <span>Xin chào ${userName}</span>
      <h4>Chúng tôi nhận được yêu cầu thiết lập lại mật khẩu cho tài khoản của bạn trên BookNest. 
    Nếu bạn đã yêu cầu điều này, vui lòng nhấp vào liên kết bên dưới để thiết lập lại mật khẩu của bạn:<h4/>
      <p>Nhấn vào liên kết bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <h4>Lưu ý:<h4/>
      <ul>
      <li>Liên kết trên sẽ hết hạn sau 15 phút kể từ thời điểm yêu cầu.</li>
      <li>Nếu bạn không yêu cầu thiết lập lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn và không có thay đổi nào được thực hiện.</li>
      </ul>
      <p>Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi qua<span>booknest@gmail.com</span></p>
      <p>Cảm ơn bạn đã sử dụng BookNest</p>
  `
    });
    return res.json({ message: "Email đặt lại mật khẩu đã được gửi" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({ message: 'Mật khẩu mới không được trùng mật khẩu cũ' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const role = req.query.role || "";

    const search = {
      ...(
        req.query.search
          ? {
            $or: [
              { name: { $regex: req.query.search, $options: "i" } },
              { phone: { $regex: req.query.search, $options: "i" } }
            ]
          }
          : {}
      ),
      ...(role ? { role } : {})
    };

    const sort = req.query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const users = await User.find(search, "-password")
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await User.countDocuments(search);

    res.json({
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      users
    });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password')
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });
    res.json(user)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, gender, birthday, phone, role } = req.body
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Không có quyền sửa user khác' });
    }
    const updateData = { name, email, gender, birthday, phone, };
    if (req.user.role === 'admin' && role) {
      updateData.role = role;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    const { password: _, ...userWithoutPassword } = updated.toObject();
    res.json({ message: 'Cập nhật thành công', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    // Chỉ admin được quyền xóa người khác
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa người dùng khác' });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    res.json({ message: 'Xóa user thành công' });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}