import express from "express";

import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controller/userController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", auth, getProfile);

router.put("/profile", auth, updateProfile);

router.put("/password", auth, changePassword);

router.delete("/profile", auth, deleteAccount);

export default router;