const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    email: String,
    created_at: Date,
    updated_at: Date,
    first_name: String,
    last_name: String,
    orders_count: Number,
    total_spent: Number,
    default_address: {
        city: String,
        province: String,
        country: String
    }
});

module.exports = mongoose.model('Customer', customerSchema);
    