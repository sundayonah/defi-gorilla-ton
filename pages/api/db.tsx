// // db.ts
// const { MongoClient, ServerApiVersion } = require("mongodb");

// const uri = "mongodb+srv://phindCode:phindCode@cluster0.kcfnncd.mongodb.net/defi_gorilla";


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// export default client;


// async function run(): Promise<void> {
//     try {
//         // Connect the client to the server (optional starting in v4.7)
//         await client.connect();

//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// run().catch(console.dir);



// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// let dbConnection: MongoClient | null = null;

// export const connectToServer = async (callback: (err?: Error) => void): Promise<void> => {
//   try {
//     await client.connect();
//     dbConnection = client.db("your_database_name");
//     console.log("Successfully connected to MongoDB.");
//     callback();
//   } catch (err) {
//     console.error("Failed to connect to MongoDB", err);
//     callback(err);
//   }
// };

// export const getDb = (): MongoClient | null => {
//   return dbConnection;
// };


// import { NextApiRequest, NextApiResponse } from 'next';
// import { MongoClient } from 'mongodb';

// export default async function post(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const uri = "mongodb+srv://phindCode:phindCode@cluster0.kcfnncd.mongodb.net/defi_gorilla-ton"
//       const { amount, userAddress, timestamp } = req.body;

//       console.log(amount, userAddress, timestamp)

//   try {
//     // Connect to MongoDB
//     const client = new MongoClient(uri);
//     await client.connect();
//     const db = client.db('gorilla-ton');
//     const collection = db.collection('gorilla-ton');

//     // Insert document into MongoDB
//     const result = await collection.insertOne({
//       amount,
//       userAddress,
//       timestamp: timestamp || new Date(), // Use provided timestamp or current time if not provided
//     });

//     console.log(result)

//     // Close MongoDB connection
//     await client.close();

//     // Return success response
//     res.status(200).json({ message: 'Data inserted successfully', insertedId: result.insertedId });
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import UserModel from '@/app/model/userModel'

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  if (req.method!== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const uri = "mongodb+srv://phindCode:phindCode@cluster0.kcfnncd.mongodb.net/defi_gorilla-ton";
  const { amount, userAddress, timestamp, reward } = req.body;

  console.log(amount, userAddress, timestamp, reward);


  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 30000 });

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('gorilla-ton');
    const collection = db.collection('transactions'); // Assuming the collection name is 'transactions'

    // Check if the address already exists
    const existingTransaction = await collection.findOne({ userAddress });

    let newReward = 0;

    if (existingTransaction) {
      // If the address exists, update the existing record
      const newTotalAmount = existingTransaction.amount + amount;
      console.log(newTotalAmount);
      if (newTotalAmount > 2_000_000_000) { // 2 SOL in lamports
        newReward = newTotalAmount * 2; // Multiply the amount by 2 if it's 2 SOL or more
      console.log(newReward)
      } else if (newTotalAmount === 2_000_000_000) { // 2 SOL in lamports
        newReward = newTotalAmount * 2; // Multiply the amount by 2 if it's 2 SOL or more
      }
      existingTransaction.amount = newTotalAmount;
      existingTransaction.reward = newReward;
      existingTransaction.timestamp = timestamp; // Update the timestamp if needed

      console.log({ newTotalAmount, newReward });
      await collection.updateOne({ userAddress }, { $set: { amount: newTotalAmount, reward: newReward, timestamp: timestamp } });
      res.status(200).json(existingTransaction);
    } else {
      // If the address does not exist, create a new record
      const newTransaction = {
        amount,
        reward,
        userAddress,
        timestamp: timestamp || new Date(),
      };
      console.log(newTransaction);
      const result = await collection.insertOne(newTransaction);
      console.log(result);
      const fullDocument = await collection.findOne({ _id: result.insertedId });
      console.log(fullDocument);
      res.status(201).json(fullDocument);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Ensure the MongoDB client is closed after the operation
    await client.close();
  }
}
