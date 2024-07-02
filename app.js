const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // ใช้ path module ในการจัดการ path ของไฟล์

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.use(express.json());

// เสิร์ฟไฟล์สถิติจากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

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
