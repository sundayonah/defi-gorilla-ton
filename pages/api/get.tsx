import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

// Function to fetch and display user's total amount and reward
export default async function get(req: NextApiRequest, res: NextApiResponse) {
  if (req.method!== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

const client = new MongoClient(process.env.MONGODB_CONNECT || "your_default_connection_string", { serverSelectionTimeoutMS: 30000 });

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