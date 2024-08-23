const express = require('express');
const Customer = require('../models/customer');
const Order = require('../models/order');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/new-customers/daily', async (req, res) => {
    try {
        // Access the raw MongoDB collection
        const customersCollection = mongoose.connection.collection('shopifyCustomers');
        
        // Aggregate new customers by year and month
        const dailyNewCustomers = await customersCollection.aggregate([
            {
                // Convert created_at to date if it's stored as a string
                $addFields: {
                    created_at_date: { $dateFromString: { dateString: "$created_at" } }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at_date" },
                        month: { $month: "$created_at_date" },
                        day:{$dayOfMonth:"$created_at_date"}, 
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1,"_id.day":1 } },
            {
              $project:{
                _id:0,
                year:"$_id.year",
                month:"$_id.month",
                day:"$_id.day",
                count:"$count"
              }
            }
        ]).toArray();
        
        if (dailyNewCustomers.length === 0) {
            return res.json({ message: 'No new customers found' });
        }

        res.json(dailyNewCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching new customers data', error });
    }
});
router.get('/new-customers/monthly', async (req, res) => {
    try {
        // Access the raw MongoDB collection
        const customersCollection = mongoose.connection.collection('shopifyCustomers');
        
        // Aggregate new customers by year and month
        const monthlyNewCustomers = await customersCollection.aggregate([
            {
                // Convert created_at to date if it's stored as a string
                $addFields: {
                    created_at_date: { $dateFromString: { dateString: "$created_at" } }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at_date" },
                        month: { $month: "$created_at_date" },
                       
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1} },
            {
              $project:{
                _id:0,
                year:"$_id.year",
                month:"$_id.month",
                count:"$count"
              }
            }
        ]).toArray();
        
        if (monthlyNewCustomers.length === 0) {
            return res.json({ message: 'No new customers found' });
        }

        res.json(monthlyNewCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching new customers data', error });
    }
});
router.get('/new-customers/yearly', async (req, res) => {
    try {
        // Access the raw MongoDB collection
        const customersCollection = mongoose.connection.collection('shopifyCustomers');
        
        // Aggregate new customers by year and month
        const yearlyNewCustomers = await customersCollection.aggregate([
            {
                // Convert created_at to date if it's stored as a string
                $addFields: {
                    created_at_date: { $dateFromString: { dateString: "$created_at" } }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at_date" },
                         
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1 } },
            {
              $project:{
                _id:0,
                year:"$_id.year",
                count:"$count"
              }
            }
        ]).toArray();
        
        if (yearlyNewCustomers.length === 0) {
            return res.json({ message: 'No new customers found' });
        }

        res.json(yearlyNewCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching new customers data', error });
    }
});


router.get('/repeat-customers/daily', async (req, res) => {
    const ordersCollection = mongoose.connection.collection('shopifyOrders');
    try {
      // Aggregation for repeat customers
      const dailyRepeatCustomers = await ordersCollection.aggregate([
        {
          $addFields: {
            created_at_date: { $dateFromString: { dateString: "$created_at" } }
          }
        },
        {
          $group: {
            _id: {
              day:{$dayOfMonth:"$created_at_date"},  
              month: { $month: "$created_at_date" },
              year:{$year: "$created_at_date"},
              customer_id: "$customer.id"
            },
            orderCount: { $sum: 1 }
          },
        },
        {
            $match: { orderCount: { $gt: 1 } } 
        },
        {
            $group:{
                _id:{
                    day:"$_id.day",
                    month:"$_id.month",
                    year:"$_id.year"    
                },
                repeatCustomersCount: { $sum: 1 }
            }
        },
        {
          $project:{
            _id:0,
            year:"$_id.year",
            month:"$_id.month",
            day:"$_id.day",
            repeatCustomersCount:"$repeatCustomersCount"
          }
        }
       
      ]).toArray();      // Debug: Print results to console

      
      console.log('Repeat Customers:', dailyRepeatCustomers);
  
      res.json(dailyRepeatCustomers);
    } catch (error) {
      console.error('Error fetching repeat customers data:', error); // Improved error logging
      res.status(500).json({ message: 'Error fetching repeat customers data', error });
    }
  });
router.get('/repeat-customers/monthly', async (req, res) => {
    const ordersCollection = mongoose.connection.collection('shopifyOrders');
    try {
      // Aggregation for repeat customers
      const monthlyRepeatCustomers = await ordersCollection.aggregate([
        {
          $addFields: {
            created_at_date: { $dateFromString: { dateString: "$created_at" } }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: "$created_at_date" },
              year:{$year: "$created_at_date"},
              customer_id: "$customer.id"
            },
            orderCount: { $sum: 1 }
          },
        },
        {
            $match: { orderCount: { $gt: 1 } } 
        },
        {
            $group:{
                _id:{
                    month:"$_id.month",
                    year:"$_id.year"    
                },
                repeatCustomersCount: { $sum: 1 }
            }
        },
        {
          $project:{
            _id:0,
            year:"$_id.year",
            month:"$_id.month",
            repeatCustomersCount:"$repeatCustomersCount"
          }
        }
       
      ]).toArray();      // Debug: Print results to console

      
      console.log('Repeat Customers:', monthlyRepeatCustomers);
  
      res.json(monthlyRepeatCustomers);
    } catch (error) {
      console.error('Error fetching repeat customers data:', error); // Improved error logging
      res.status(500).json({ message: 'Error fetching repeat customers data', error });
    }
  });
router.get('/repeat-customers/yearly', async (req, res) => {
    const ordersCollection = mongoose.connection.collection('shopifyOrders');
    try {
      // Aggregation for repeat customers
      const yearlyRepeatCustomers = await ordersCollection.aggregate([
        {
          $addFields: {
            created_at_date: { $dateFromString: { dateString: "$created_at" } }
          }
        },
        {
          $group: {
            _id: {
              year:{$year: "$created_at_date"},
              customer_id: "$customer.id"
            },
            orderCount: { $sum: 1 }
          },
        },
        {
            $match: { orderCount: { $gt: 1 } } 
        },
        {
            $group:{
                _id:{
                    year:"$_id.year"    
                },
                repeatCustomersCount: { $sum: 1 }
            }
        },
        {
          $project:{
            _id:0,
            year:"$_id.year",
            repeatCustomersCount:"$repeatCustomersCount"
          }
        }
       
      ]).toArray();      // Debug: Print results to console

      
      console.log('Repeat Customers:', yearlyRepeatCustomers);
  
      res.json(yearlyRepeatCustomers);
    } catch (error) {
      console.error('Error fetching repeat customers data:', error); // Improved error logging
      res.status(500).json({ message: 'Error fetching repeat customers data', error });
    }
  });





router.get('/geographical-distribution', async (req, res) => {
    try {
      const customersCollection = mongoose.connection.collection('shopifyCustomers');
  
      // Aggregate data to count customers by city
      const cities = await customersCollection.aggregate([
        { $unwind: "$addresses" },
        { $group: { _id: "$addresses.province", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        {
          $project:{
            _id:0,
            state:"$_id",
            count:"$count"
          }
        }

      ]).toArray();
  
      if (cities.length === 0) {
        return res.status(404).json({ message: 'No data found' });
      }
  
      res.json(cities);
    } catch (err) {
      console.error('Error fetching geographical distribution data:', err);
      res.status(500).json({ message: 'Error fetching geographical distribution data' });
    }
  });
router.get('/customer-lifetime-value', async (req, res) => {
    const ordersCollection = mongoose.connection.collection('shopifyOrders');
    try {
        const clvByCohorts = await ordersCollection.aggregate([
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
                        month: { $month: "$created_at_date" },
                        customer_id: "$customer.id"
                    },
                    totalRevenue: { $sum: "$order_total" }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$_id.year",
                        month: "$_id.month"
                    },
                    totalRevenue: { $sum: "$totalRevenue" },
                    customerCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalRevenue: {$toDouble:"$totalRevenue"},
                    customerCount: 1
                }
            }
        ]).toArray();
        console.log('Customer Lifetime Value by Cohorts:', clvByCohorts);
        res.json(clvByCohorts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer lifetime value data', error });
    }
});

module.exports = router;
