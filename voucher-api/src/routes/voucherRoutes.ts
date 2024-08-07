// src/routes/voucherRoutes.ts
import { IncomingMessage, ServerResponse } from "http";
import { Db } from "mongodb";
import { getVouchers, createVoucher, getVoucherById, updateVoucher, deleteVoucherById } from "../models/voucherModel";

export const handleVoucherRoutes = async (req: IncomingMessage, res: ServerResponse, db: Db) => {
  const urlParts = req.url?.split("/") || [];
  const voucherId = urlParts[2]; // Extract voucher ID
  const voucherDetail = urlParts[3]; // Extract additional detail (e.g., balance or any other parameter)

  if (req.method === "GET") {
    if (voucherId) {
      try {
        const voucher = await getVoucherById(db, voucherId);
        if (voucher) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(voucher));
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Voucher Not Found");
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    } else {
      // Get all vouchers
      try {
        const vouchers = await getVouchers(db);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(vouchers));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    }
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const voucher = JSON.parse(body);
        const newVoucherId = await createVoucher(db, voucher);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: newVoucherId }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
      }
    });
  } else if (req.method === "PUT") {
    if (voucherId && voucherDetail) {
      try {
        const result = await updateVoucher(db, voucherId, JSON.parse(voucherDetail));
        if (result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Voucher updated successfully" }));
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Voucher Not Found");
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request: Missing voucher ID or details");
    }
  } else if (req.method === "DELETE") {
    if (voucherId) {
      try {
        const result = await deleteVoucherById(db, voucherId);
        if (result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Voucher deleted successfully" }));
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Voucher Not Found");
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request: Missing voucher ID");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};
