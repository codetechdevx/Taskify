const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let tasks = []; // in-memory for now

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Create a task
app.post("/api/tasks", (req, res) => {
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.map(task =>
    task.id == id ? { ...task, ...req.body } : task
  );
  res.json({ message: "Task updated" });
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id != id);
  res.json({ message: "Task deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
