import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';

const router = express.Router();

router.route('/').get(authMiddleware, getTasks)
.post(authMiddleware, createTask);
router.route('/:id').put(authMiddleware, updateTask);
router.route("/:id/delete").put(authMiddleware, deleteTask);
router.put("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
   
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
      console.log("ERROR:", error);

    res.status(500).json({ message: error.message });
  }
});
export default router;
