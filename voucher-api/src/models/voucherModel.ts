// src/models/voucherModel.ts
import { Db, ObjectId } from "mongodb";
import { Voucher } from "../types/interface";

// Fetch all vouchers
export const getVouchers = async (db: Db) => {
  return db.collection("vouchers").find().toArray();
};

// Create a new voucher
export const createVoucher = async (db: Db, voucher: Voucher) => {
  const result = await db.collection("vouchers").insertOne(voucher);
  return result.insertedId;
};

// Fetch a voucher by its ID
export const getVoucherById = async (db: Db, voucherId: string) => {
  try {
    const objectId = new ObjectId(voucherId);
    return db.collection("vouchers").findOne({ _id: objectId });
  } catch (error) {
    console.error("Error fetching voucher by ID:", error);
    throw error;
  }
};

// Update a voucher by its ID
export const updateVoucher = async (db: Db, voucherId: string, update: Partial<Voucher>) => {
  try {
    const objectId = new ObjectId(voucherId);
    const result = await db.collection("vouchers").updateOne({ _id: objectId }, { $set: update });
    return result.modifiedCount > 0; // Return true if modified, false otherwise
  } catch (error) {
    console.error("Error updating voucher:", error);
    throw error;
  }
};

export const deleteVoucherById = async (db: Db, voucherId: string) => {
  try {
    const objectId = new ObjectId(voucherId);
    const result = await db.collection("vouchers").deleteOne({ _id: objectId });
    return result.deletedCount > 0; // Return true if deleted, false otherwise
  } catch (error) {
    console.error("Error deleting voucher by ID:", error);
    throw error;
  }
};
