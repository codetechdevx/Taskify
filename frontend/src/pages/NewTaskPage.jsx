import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewTaskPage() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "Pending"
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    }).then(() => navigate("/"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Task</h1>
      <input name="title" placeholder="Title" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange} />
      <input type="date" name="dueDate" onChange={handleChange} />
      <select name="priority" onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
}

export default NewTaskPage;
