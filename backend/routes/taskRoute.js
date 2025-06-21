import express from "express"
import { addTask, getTask, removeTask, updateTaskStatus } from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/addTask", requireAuth, addTask)
router.get("/getTask",requireAuth, getTask)
router.delete("/removeTask/:id", requireAuth, removeTask)
router.put("/updateStatus/:id", requireAuth, updateTaskStatus)

export default router;