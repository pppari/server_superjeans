require("dotenv").config;
const userModel = require("../models/user.model"); // this is your user.service
const argon2 = require("argon2");
const jwt = require("../utils/jwt");
const { sendVerificationEmail, sendResetRequest } = require("../middlewares/nodemailer"); // use your file name
const toObjectId = require("../utils/toObjectId");

const { CLIENT_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "กรุณาระบุอีเมลและรหัสผ่าน" });
    }

    // ✅ Check if user exists
    const existing = await userModel.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
    }

    // ✅ Hash password
    const hashed = await argon2.hash(password);

    // ✅ Create user
    const user = await userModel.createUser({
      email: email.trim(),
      password: hashed,
    });

    const payload = {
      id: user._id,
    };

    const token = jwt.generateToken(payload);
    // ✅ Send verification email with JWT
    await sendVerificationEmail(token, user.email);

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมลของคุณ",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่ฝั่งเซิร์ฟเวอร์" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบบัญชีผู้ใช้ในระบบ" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({
          message:
            "บัญชียังไม่ได้รับการยืนยัน กรุณาเช็คอีเมลของท่านเพื่อทำการยืนยัน",
        });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      isVerified: user.isVerified,
    };

    const token = jwt.generateToken(payload);

    res.status(200).json({ token, user, message: "เข้าสู่ระบบสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่ฝั่งเซิร์ฟเวอร์" });
  }
};

const verify = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Missing token");

  try {
    const decoded = jwt.verifyToken(token);
    const userId = decoded.id;
    

    const user = await userModel.getUserById(toObjectId(userId));
    console.log(userId)
    console.log(user);
    if (!user) return res.status(404).send("User not found");

    if (user.isVerified) return res.send("Account already verified.");

    user.isVerified = true;
    await user.save();

    res.redirect(`${CLIENT_URL}/verified`);
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid or expired token");
  }
};

const forgot = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบบัญชีผู้ใช้ในระบบ" });
    }
    const token = jwt.generateToken({id: user._id});
    sendResetRequest(token, email)
    res.status(200).json({message: "ส่งคำขอสำเร็จ กรุณาตรวจสอบอีเมลของคุณ"})
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const reset = async (req, res) => {
  const {password, token} = req.body;
  if (!token) return res.status(400).send("Missing token");

  try {
    const decoded = jwt.verifyToken(token);
    const userId = decoded.id;
const hashed = await argon2.hash(password)
    const user = await userModel.getUserById(toObjectId(userId));
    if (!user) return res.status(404).send("User not found");

    const result = await userModel.updateUser(toObjectId(userId), {password: hashed})

    res.status(200).json({message: "รีเซ็ตรหัสผ่านสำเร็จ"})
  } catch (err) {
    console.error(err);
    res.status(500).json("err");
  }
};

const changePassword = async(req, res) => {
  const {userId} = req.params;
  const {oldPassword, newPassword} = req.body; 
  try{
    const user = await userModel.getUserById(toObjectId(userId));
    if (!user) return res.status(404).send("User not found");
    const isMatch = await argon2.verify(user.password, oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });
    }
    const hashed = await argon2.hash(newPassword);
    await userModel.updateUser(toObjectId(userId), {password: hashed})
    res.status(200).json({message: "เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่อีกครั้ง"})
  }catch(err){
    console.error(err);
    res.status(500).json(err)
  }
}

module.exports = {
  register,
  login,
  verify,
  forgot,
  reset,
  changePassword
};
