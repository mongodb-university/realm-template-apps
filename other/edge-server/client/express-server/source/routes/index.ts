import { Router } from "express";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todos";
import { login, logout } from "../controllers/auth";

const router: Router = Router();

// Todo routes
router.get("/todos", getTodos);
router.post("/add-todo", addTodo);
router.put("/update-todo/:id", updateTodo);
router.delete("/delete-todo/:id", deleteTodo);

// Auth routes
router.post("/login", login);
router.post("/logout", logout);

export default router;
