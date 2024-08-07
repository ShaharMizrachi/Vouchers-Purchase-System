import { ObjectId } from "mongodb";

export interface Voucher {
  _id?: ObjectId;
  amount: number;
  cost: number;
  company: string;
}

export interface User {
  userId?: ObjectId;
  name: string;
  password: string;
  balance: number;
}

export interface PurchasedVoucher {
  _id?: ObjectId;
  userId: ObjectId;
  voucherId: ObjectId;
}
