const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: String,
    created_at: Date,
    total_price: Number,
    total_price_set: {
        shop_money: {
            amount: Number,
            currency_code: String
        }
    },
    customer: {
        id: mongoose.Schema.Types.Mixed,
        email: String,
        created_at: Date,
        updated_at: Date,
        first_name: String,
        last_name: String,
        orders_count: Number,
        state: String,
        total_spent: Number,
    }
});

module.exports = mongoose.model('Order', orderSchema);
