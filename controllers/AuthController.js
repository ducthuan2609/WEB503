const User = require("../models/User");
const bcrypt = require("bcryptjs"); //mã hóa password
const jwt = require("jsonwebtoken"); //tạo token

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body; //lấy thông tin người dùng gửi lên
    //kiểm tra đã tồn tại email người dùng đk hay chưa
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); //mã hóa password
    //lưu thông tin tài khoản vào db
    const newUser = User.create({
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      res.status(200).json({
        message: "Đăng ký thành công",
      });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    //lấy thông tin email/password
    const { email, password } = req.body;
    //Kiểm tra email có tồn tại trong hệ thống không?
    const user = await User.findOne({ email });
    if (!user) {
      //nếu ko tồn tại user
      return res.status(400).json({ message: "Email ko tồn tại" });
    }
    //Kiểm tra password
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) {
      return res.status(400).json({ message: "Sai thông tin đăng nhập" });
    }
    //tạo token
    // jwt.sign(data, secretKey, {expiresIn: })
    //expiresIn: 60*60*24 | expiresIn: '1h'|'1d'
    const token = jwt.sign({ id: user.id }, "wd18412", { expiresIn: 60 * 60 });
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
    });
  } catch {
    res.status(400).json({ message: "Something went wrong" });
  }
};
