import { Db, ObjectId } from "mongodb";
import { User } from "../types/interface";

export const getUsers = async (db: Db) => {
  return db.collection("users").find().toArray();
};

export const createUser = async (db: Db, user: User) => {
  const result = await db.collection("users").insertOne(user);
  return result.insertedId;
};

export const getUsersById = async (db: Db, userId: string) => {
  const objectId = new ObjectId(userId);
  console.log("objectId:", objectId);

  return db.collection("users").findOne({ _id: objectId });
};

export const updateUserBalance = async (db: Db, userId: string, balance: number) => {
  const userObjectId = getUsersById(db, userId);
  const result = await db.collection("users").updateOne({ _id: userObjectId }, { $set: { balance } });

  return result.modifiedCount;
};
