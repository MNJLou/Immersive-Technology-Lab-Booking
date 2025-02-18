import mongoose from 'mongoose';

/**
 * Creates a connection to the MongoDB database
 */
const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
  }
};

/**
 * Disconnects from the MongoDB database
 */
const disconnectMongo = async () => {
    if(mongoose.connection.readyState === 0) return;
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.log('Error disconnecting from MongoDB', error);
    }
  };

/**
 * Closes the MongoDB client
 */
const closeClient = async () => {
    await mongoose.connection.close();
}

export { connectMongo, closeClient };