import { MongoClient } from 'mongodb';

const mongoUri = 'mongodb://127.0.0.1:27017/mydatabase'; // Replace with your MongoDB connection URI
const dbName = 'kritic-app';

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