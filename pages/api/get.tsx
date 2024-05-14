import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

// Function to fetch and display user's total amount and reward
export default async function get(req: NextApiRequest, res: NextApiResponse) {
  if (req.method!== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const uri = "mongodb+srv://phindCode:phindCode@cluster0.kcfnncd.mongodb.net/defi_gorilla-ton";
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 30000 });

//   console.log(userAddress)
const addr = "0QASAh83BCbEvpZEsKFcw-STLK7Zw2jsO1MiXYaVWyAm8aaQ"

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('gorilla-ton');
    const collection = db.collection('transactions');
    // console.log(collection)

    // Fetch the user's transactions
    const transactions = await collection.find().toArray(); // Convert cursor to array

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    // Ensure the MongoDB client is closed after the operation
    await client.close();
  }
}
