import { Router } from "express";
import { handleStatusUpdate } from "../controllers/accountabilityPartnerRequestController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/status/:accepterId", handleStatusUpdate);

export default router;
