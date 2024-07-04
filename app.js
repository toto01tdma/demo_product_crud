const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storages/product/'); // เก็บไฟล์ในโฟลเดอร์ storages/product
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ไม่ให้ซ้ำกัน พร้อมนามสกุลเดิม
  }
});

const upload = multer({ storage: storage }); // ตั้งค่า multer

const productRouter = require('./routes/product');
app.use('/products', productRouter);

// เสิร์ฟไฟล์ index.html เมื่อเข้า root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  const host = process.env.HOST || 'localhost';
  console.log(`Server is running on http://${host}:${port}`);
});
