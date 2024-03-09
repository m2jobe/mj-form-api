import express from "express";
import filterResponse from "../controllers/filterResponse.js";

const apiRouter = express.Router();

apiRouter.get("/filteredResponses", filterResponse);

export default apiRouter;
