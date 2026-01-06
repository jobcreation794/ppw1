const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Member = require("./models/Member");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

/* ===== MongoDB Connection ===== */
mongoose.connect("mongodb://127.0.0.1:27017/prosperity_party", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

/* ===== Image Upload Setup ===== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* ===== Register Member ===== */
app.post("/api/register", upload.single("photo"), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, region, dob, address } = req.body;

    // check duplicate
    const exists = await Member.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const count = await Member.countDocuments();
    const memberId = `EPP-${1001 + count}`;

    const member = new Member({
      memberId,
      firstName,
      lastName,
      email,
      phone,
      region,
      dob,
      address,
      photo: req.file ? `/uploads/${req.file.filename}` : null
    });

    await member.save();

    res.json({
      message: "Registration successful",
      memberId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===== Get All Members (Admin) ===== */
app.get("/api/members", async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.json(members);
});

/* ===== Search by Member ID ===== */
app.get("/api/member/:id", async (req, res) => {
  const member = await Member.findOne({ memberId: req.params.id });
  if (!member) return res.status(404).json({ message: "Not found" });
  res.json(member);
});

/* ===== Update Member ===== */
app.put("/api/member/:id", async (req, res) => {
  await Member.findOneAndUpdate(
    { memberId: req.params.id },
    req.body
  );
  res.json({ message: "Updated" });
});

/* ===== Delete Member ===== */
app.delete("/api/member/:id", async (req, res) => {
  await Member.findOneAndDelete({ memberId: req.params.id });
  res.json({ message: "Deleted" });
});

/* ===== Start Server ===== */
app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
