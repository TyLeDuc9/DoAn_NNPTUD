const dotenv = require('dotenv');
dotenv.config(); 
// require("./cron/cartReminderCron");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoute = require('./route/userRoute');
const authRoute = require('./route/authRoute');
const app = express();
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8001;
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});