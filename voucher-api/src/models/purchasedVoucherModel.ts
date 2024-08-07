import { Db, ObjectId } from "mongodb";
import { PurchasedVoucher } from "../types/interface";

export const getPurchasedVouchers = async (db: Db) => {
  return db.collection("purchased_vouchers").find().toArray();
};

export const createPurchasedVoucher = async (db: Db, purchasedVoucher: PurchasedVoucher) => {
  const result = await db.collection("purchased_vouchers").insertOne(purchasedVoucher);
  return result.insertedId;
};
