
import mongoose, { Document, Schema } from "mongoose";

// Define interface for the document
interface IUserModel extends Document {
  amount: number;
  reward: number;
  address: string;
  timestamp: Date;
  // Add any other fields you need
}

// Define schema using the interface
const transactionSchema = new Schema<IUserModel>({
  amount: { type: Number },
  reward: { type: Number },
  address: { type: String},
  timestamp: { type: Date },
  // Add any other fields you need
});

// Create a model from the schema
const UserModel =
  mongoose.models.UserModel ||
  mongoose.model<IUserModel>('UserModel', transactionSchema);

// Export the model
export default UserModel;


// import mongoose from 'mongoose';

// const transactionSchema = new mongoose.Schema({
//   amount: Number,
//   userAddress: String,
//   timestamp: Date,
//   reward: Number,
// });

// const UserModel = mongoose.model('UserModel', transactionSchema);

// export default UserModel;
