

import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  if (req.method!== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { amount, userAddress, timestamp, reward } = req.body;


  const client = new MongoClient(process.env.MONGODB_CONNECT || "your_default_connection_string", { serverSelectionTimeoutMS: 30000 });

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
