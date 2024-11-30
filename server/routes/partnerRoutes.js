import { Router } from "express";
import {
  endPartnership,
  getPartnerRequests,
  handleStatusUpdate,
  sendAccountabilityPartnerRequest,
} from "../controllers/partnerController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/request", isAuthenticated, sendAccountabilityPartnerRequest);
router.post("/status", isAuthenticated, handleStatusUpdate);
router.get("/user", isAuthenticated, getPartnerRequests);
router.delete("/end", isAuthenticated, endPartnership);

export default router;
