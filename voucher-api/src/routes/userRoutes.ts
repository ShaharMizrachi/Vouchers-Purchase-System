import { IncomingMessage, ServerResponse } from "http";
import { Db, ObjectId } from "mongodb";
import { getUsers, getUsersById, createUser, updateUserBalance } from "../models/userModel";

export const handleUserRoutes = async (req: IncomingMessage, res: ServerResponse, db: Db) => {
  const urlParts = req.url?.split("/") || [];
  const userId = urlParts[2]; // Extract user ID

  if (req.method === "GET") {
    if (userId) {
      try {
        const user = await getUsersById(db, userId);
        console.log("user:", user);
        if (user) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("User Not Found");
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    } else {
      //all users
      try {
        const users = await getUsers(db);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
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
        const user = JSON.parse(body);
        const userId = await createUser(db, user);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: userId }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
      }
    });
  } else if (req.method === "PUT") {
    const userBalance = urlParts[3]; //Extract balance

    if (userId && userBalance) {
      try {
        const newBalance = parseInt(userBalance);

        if (newBalance >= 0) {
          const result = await updateUserBalance(db, userId, newBalance);

          if (result >= 0) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Balance updated successfully" }));
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Bad Request: Balance can not be low then zero");
          }
        } else {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Bad Request: Balance must be a non-negative number");
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request: Missing user ID or balance");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};
