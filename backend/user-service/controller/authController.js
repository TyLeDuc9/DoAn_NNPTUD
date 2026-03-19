const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const FacebookTokenStrategy = require("passport-facebook-token");
const passport = require("passport");
const axios = require("axios");
exports.registerEmployeeEmail = async (req, res) => {
  try {
    const { name, email, password, phone, gender, birthday } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email và mật khẩu bắt buộc" });

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      birthday,
      role: "employee",
    });

    res.status(201).json({ message: "Tạo nhân viên thành công", user: newEmployee });
  } catch (err) {
    res.status(500).json({ message: "Tạo nhân viên thất bại", error: err.message });
  }
};
// Đăng nhập bằng Google
exports.loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body; // frontend gửi id_token
    if (!token) return res.status(400).json({ message: "Thiếu token Google" });

    // Xác thực token Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // lấy dữ liệu user từ Google
    const { email, name, sub } = payload;

    // Kiểm tra user có trong DB chưa
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: sub, // hoặc random, vì user này đăng nhập Google không dùng password
        role: "user",
      });
    }

    // Tạo JWT token cho ứng dụng của bạn
    const appToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: appToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        birthday: user.birthday,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
};
exports.registerByEmail = async (req, res) => {
  try {
    const { email, password } = req.body; 
    if (!email || !password) {
      return res.status(400).json({ message: "Cần nhập email và mật khẩu" });
    }

    const existsEmail = await User.findOne({ email });
    if (existsEmail)
      return res.status(400).json({ message: "Email đã tồn tại" });

    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 kí tự" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({ message: "Đăng ký thành công", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
exports.loginByEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Cần nhập email và mật khẩu' });
    }

    const existUser = await User.findOne({ email });
    if (!existUser) return res.status(400).json({ message: 'Email chưa đăng ký' });

    const checkPassword = await bcrypt.compare(password, existUser.password);
    if (!checkPassword) return res.status(400).json({ message: 'Mật khẩu không đúng' });

    const token = jwt.sign(
      { id: existUser._id, role: existUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { password: _, ...userData } = existUser.toObject();

    res.json({
      token,
      user: userData
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
