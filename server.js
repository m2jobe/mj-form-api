import express from "express";
import { PORT } from "./config.js";
import apiRouter from "./routes/api.js";

const app = express();

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
