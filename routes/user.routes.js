import express from "express";
import User from "../model/user.model.js";

const router = express.Router();

// POST /api/users — Foydalanuvchini yaratish
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username va password majburiy." });
    }

    // IP manzilini olish
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // IPv6 localhostni IPv4 ko‘rinishga o‘tkazish
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    const port = req.socket.remotePort;

    const adress = {
      ip,
      port,
    };

    const newUser = new User({
      username,
      password,
      adress,
    });

    await newUser.save();

    res.status(201).json({
      message: "Foydalanuvchi yaratildi",
      data: newUser,
      status: "success",
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Server xatosi", error: err.message });
  }
});

// GET /api/users — Barcha foydalanuvchilarni olish
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ data: users, status: "success" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Ma'lumotlarni olishda xatolik",
      error: err.message,
    });
  }
});

export default router;
