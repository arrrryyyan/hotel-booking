import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailaility } from "../controllers/roomController.js";

const roomRouter = express.Router();
roomRouter.post('/', upload.array("images", 4),  createRoom);
roomRouter.get('/', getRooms);
roomRouter.get('/owner', protect, getOwnerRooms);
roomRouter.get('/toggle-availability', protect, toggleRoomAvailaility);

export default roomRouter;