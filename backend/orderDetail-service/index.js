const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const orderDetailRoute = require('./route/orderDetailRoute');
const app = express();
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8000;
app.use('/api/order-detail', orderDetailRoute);
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});