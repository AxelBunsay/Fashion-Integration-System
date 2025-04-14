const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/logs', require('./routes/logs'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));