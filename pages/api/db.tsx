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



import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const uri = "mongodb+srv://phindCode:phindCode@cluster0.kcfnncd.mongodb.net/defi_gorilla"
      const { amount, userAddress, timestamp } = req.body;


  try {
    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('gorilla-ton');
    const collection = db.collection('gorilla-ton');

    // Example: Insert document into MongoDB
 // Insert document into MongoDB
    const result = await collection.insertOne({
      amount,
      userAddress,
      timestamp: timestamp || new Date(), // Use provided timestamp or current time if not provided
    });

    console.log(result)

    // Close MongoDB connection
    await client.close();

    // Return success response
    res.status(200).json({ message: 'Data inserted successfully', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
