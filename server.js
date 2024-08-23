require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const salesRoutes = require('./routes/sales.js');
const customerRoutes = require('./routes/customers');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
