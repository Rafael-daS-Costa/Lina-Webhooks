const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING);

const db = client.db('tiabette');
const collectionUser = db.collection('user');

async function createUser(name, phoneNumber) {
  if (!name || !phoneNumber) {
    throw new Error('Name and phoneNumber are required');
  }

  try {
    const result = await collectionUser.insertOne({ name, phoneNumber });
    return result.insertedId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

async function findUserByPhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    throw new Error('Phone number is required');
  }

  try {
    return (await collectionUser.findOne({ phoneNumber })) || null;
  } catch (error) {
    console.error('Error finding user by phone number:', error);
    throw new Error('Failed to find user');
  }
}

module.exports = { findUserByPhoneNumber, createUser };
