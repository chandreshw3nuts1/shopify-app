import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGO_CONNECTION_STRING; // Replace with your MongoDB connection URI
const dbName = process.env.MONGO_CONNECTION_DATABASE;

export async function mongoConnection() {
  const client = new MongoClient(mongoUri);

  try {
    // Connect to MongoDB
    await client.connect();

    // Access the database and return the database object
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}