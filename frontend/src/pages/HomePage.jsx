import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const filteredTasks = tasks.filter(task => 
    filter === "All" ? true : task.status === filter
  );

  return (
    <div>
      <h1>All Tasks</h1>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>Pending</option>
        <option>Completed</option>
      </select>

      <ul>
        {filteredTasks.map(task => (
            <li key={task._id}>
            <Link to={`/tasks/${task._id}`}>{task.title}</Link> - {task.priority}
            </li>
        ))}
    </ul>


        
      <Link to="/tasks/new">Add Task</Link>
    </div>
  );
}

export default HomePage;
