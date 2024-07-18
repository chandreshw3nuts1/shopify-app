import mongoose from 'mongoose';


const mongoUri = process.env.MONGO_CONNECTION_STRING; // Replace with your MongoDB connection URI
const dbName = process.env.MONGO_CONNECTION_DATABASE;

export async function mongoConnection() {
  try {
    mongoose.connect(`${process.env.MONGO_CONNECTION_STRING}/${process.env.MONGO_CONNECTION_DATABASE}`, {
      useUnifiedTopology: true,
    });
    
    const db = mongoose.connection;
    
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}