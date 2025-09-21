import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditTaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks/${id}`)
      .then(res => res.json())
      .then(data => setTask(data));
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    }).then(() => navigate("/"));
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" })
      .then(() => navigate("/"));
  };

  if (!task) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Task</h1>
      <input name="title" value={task.title} onChange={handleChange} />
      <textarea name="description" value={task.description} onChange={handleChange} />
      <input type="date" name="dueDate" value={task.dueDate || ""} onChange={handleChange} />
      <select name="priority" value={task.priority} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <select name="status" value={task.status} onChange={handleChange}>
        <option>Pending</option>
        <option>Completed</option>
      </select>
      <button type="submit">Update</button>
      <button type="button" onClick={handleDelete}>Delete</button>
    </form>
  );
}

export default EditTaskPage;
