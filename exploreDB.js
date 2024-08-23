const mongoose = require('mongoose');
const fs = require('fs'); // Import the file system module


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

  const Customer = mongoose.model('Customer', customerSchema);  
async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/RQ_Analytics?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Connection error:', err);
  }
}



async function exploreCollection(collectionName) {
    try {
        const collection = mongoose.connection.collection(collectionName);
        const documents = await collection.find({}).limit(1).toArray();
        
        // Create a log entry for the collection
        const logEntry = `Documents in ${collectionName}:\n${JSON.stringify(documents, null, 2)}\n\n`;
        
        // Append the log entry to a text file
        fs.appendFileSync('database_exploration.txt', logEntry);
    } catch (err) {
        console.error(`Error fetching documents from ${collectionName}:`, err);
    }
}

async function run() {
    await connectDB();
    
    // Clear the file before writing new logs
    fs.writeFileSync('database_exploration.txt', ''); 
    
    /* await exploreCollection('shopifyCustomers');
    await exploreCollection('shopifyProducts'); */
    await exploreCollection('shopifyOrders');
    
    mongoose.connection.close();
}
/* run() */

async function testQuery() {
    try {
      // Connect to the database
      await connectDB();
  
      // Perform the query
      const results = await Customer.find({}, { created_at: 1 }).limit(5).exec();
  
      // Log the results
      console.log('Query Results:', JSON.stringify(results, null, 2));
  
      // Close the database connection
      mongoose.connection.close();
    } catch (err) {
      console.error('Error performing query:', err);
    }
  }


/* testQuery(); */

