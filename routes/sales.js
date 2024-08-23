const express = require('express');
const Order = require('../models/order');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/total-sales/daily', async (req, res) => {
    
    try {
        const ordersCollection = mongoose.connection.collection('shopifyOrders');
        const salesData = await ordersCollection.aggregate([
            {
                // Convert created_at to date if it's stored as a string
                $addFields: {
                    created_at_date: { $dateFromString: { dateString: "$created_at" } },
                    total_price:{$toDecimal:"$total_price_set.shop_money.amount"}
                }
                
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at_date" },
                        month: { $month: "$created_at_date" },
                        day: { $dayOfMonth: "$created_at_date" }
                    },
                    totalSales: { $sum: "$total_price" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
            },
            {
                $project: {
                  _id: 0, // Exclude the _id field
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                  revenue: { $toDouble: "$totalSales" } // Rename totalSales to revenue
                }
            }
        ]).toArray();
        res.json(salesData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales data', error });
    }
});
router.get('/total-sales/monthly', async (req, res) => {
    
    try {
        const ordersCollection = mongoose.connection.collection('shopifyOrders');
        const monthlysalesData = await ordersCollection.aggregate([
            {
                // Convert created_at to date if it's stored as a string
                $addFields: {
                    created_at_date: { $dateFromString: { dateString: "$created_at" } },
                    total_price:{$toDecimal:"$total_price_set.shop_money.amount"}
                }
                
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at_date" },
                        month: { $month: "$created_at_date" }
                        
                    },
                    totalSales: { $sum: "$total_price" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                $project: {
                  _id: 0, // Exclude the _id field
                  year: "$_id.year",
                  month: "$_id.month",
                  revenue: { $toDouble: "$totalSales" } // Rename totalSales to revenue
                }
            }
        ]).toArray();
        res.json(monthlysalesData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales data', error });
    }
});
router.get('/total-sales/yearly', async (req, res) => {
    
    try {
        const ordersCollection = mongoose.connection.collection('shopifyOrders');
        const yearlysalesData = await ordersCollection.aggregate([
            {
                // Convert created_at to date if it's stored as a string
                $addFields: {
                    created_at_date: { $dateFromString: { dateString: "$created_at" } },
                    total_price:{$toDecimal:"$total_price_set.shop_money.amount"}
                }
                
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at_date" },
                        
                        
                    },
                    totalSales: { $sum: "$total_price" }
                }
            },
            {
                $sort: { "_id.year": 1 }
            },
            {$project: {
                _id: 0, // Exclude the _id field
                year: "$_id.year",
                revenue: { $toDouble: "$totalSales" } // Rename totalSales to revenue
              }}
        ]).toArray();
        res.json(yearlysalesData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales data', error });
    }
});

router.get('/sales-growth-rate', async (req, res) => {
    try {
        const ordersCollection = mongoose.connection.collection('shopifyOrders');
        const growthRateData = await ordersCollection.aggregate([
            {
                $addFields: {
                    created_at_date: { $dateFromString: { dateString: "$created_at" } },
                    order_total: { $toDecimal: "$total_price" }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at_date" },
                        month: { $month: "$created_at_date" }
                    },
                    totalSales: { $sum: "$order_total" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: { year: "$_id.year", month: "$_id.month", totalSales: "$totalSales" } }
                }
            },
            {
                $unwind: "$data"
            },
            {
                $setWindowFields: {
                    partitionBy: null,
                    sortBy: { "data.year": 1, "data.month": 1 },
                    output: {
                        previousSales: {
                            $shift: {
                                output: "$data.totalSales",
                                by: -1
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    growthRate: {
                        $cond: {
                            if: { $eq: ["$previousSales", null] },
                            then: 0,
                            else: {
                                $multiply: [
                                    { $divide: [{ $subtract: ["$data.totalSales", "$previousSales"] }, "$previousSales"] },
                                    100
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$data.year",
                    month: "$data.month",
                    totalSales: {$toDouble:"$data.totalSales"},
                    growthRate: {$toDouble:"$growthRate"}
                }
            }
        ]).toArray();
        res.json(growthRateData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching growth rate data', error });
    }
});

module.exports = router;
