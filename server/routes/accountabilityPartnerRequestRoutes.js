import { Router } from "express";
import {
  getPartnerRequests,
  handleStatusUpdate,
  sendAccountabilityPartnerRequest,
} from "../controllers/accountabilityPartnerRequestController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/request", isAuthenticated, sendAccountabilityPartnerRequest);
router.post("/status", isAuthenticated, handleStatusUpdate);
router.get("/user", isAuthenticated, getPartnerRequests);

export default router;
