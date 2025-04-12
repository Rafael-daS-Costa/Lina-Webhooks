const { MongoClient } = require('mongodb');
require('dotenv').config();

const { MONGO_DB_CONNECTION_STRING } = process.env;

const client = new MongoClient(MONGO_DB_CONNECTION_STRING);

const db = client.db('tiabette');
const collectionUser = db.collection('user');

async function createUser(name, phoneNumber) {
  if (!name || !phoneNumber) {
    throw new Error('Name and phoneNumber are required');
  }

  try {
    const result = await collectionUser.insertOne({ name, phoneNumber });
    console.log('User created successfully: ', { userName, phoneNumber });
    return result.insertedId;
  } catch (error) {
    console.error('Error creating user:', { error, userName, phoneNumber });
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
    console.error('Error finding user by phone number:', { error });
    throw new Error('Failed to find user');
  }
}

async function getAllAllowedUsers() {
  try {
    const result = await db.collection('allowedUsers').find({}).toArray();

    return result.length > 0 ? result : null;
  } catch (error) {
    console.log('getAllAllowedUsers error: ', { error });
    throw error;
  }
}

module.exports = { findUserByPhoneNumber, createUser, getAllAllowedUsers };
