import { Router } from "express";
import {
  Login,
  ProtectRoute,
  Register,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/protected", isAuthenticated, ProtectRoute);

export default router;
