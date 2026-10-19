const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

// Gunakan routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});