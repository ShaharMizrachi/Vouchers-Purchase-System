import { MongoClient, Db } from "mongodb";

const MONGO_URL = "mongodb://localhost:27017";
let db: Db | null = null;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) return db;

  const client = await MongoClient.connect(MONGO_URL, {});
  db = client.db("voucher-system");
  console.log("Connected to MongoDB");
  return db;
};

export const getDatabase = () => {
  if (!db) throw new Error("Database not initialized");
  return db;
};
