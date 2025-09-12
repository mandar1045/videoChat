import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, getGroups, addMember, leaveGroup, deleteGroup, updateGroupProfilePic } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/", protectRoute, getGroups);
router.post("/:id/members", protectRoute, addMember);
router.put("/:id/profile-pic", protectRoute, updateGroupProfilePic);
router.delete("/:id/leave", protectRoute, leaveGroup);
router.delete("/:id", protectRoute, deleteGroup);

export default router;