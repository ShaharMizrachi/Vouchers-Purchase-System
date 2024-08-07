import { createServer, IncomingMessage, ServerResponse } from "http";

import { connectToDatabase } from "./utils/database";
import { handleUserRoutes } from "./routes/userRoutes";
import { handleVoucherRoutes } from "./routes/voucherRoutes";

const PORT = 3000;

const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const db = await connectToDatabase();
    const urlParts = req.url?.split("/") || [];
    // console.log(urlParts[1]);

    switch (urlParts[1]) {
      case "users":
        handleUserRoutes(req, res, db);
        break;
      case "vouchers":
        handleVoucherRoutes(req, res, db);
        break;
      default:
        throw new Error("no path find");
    }
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const server = createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
