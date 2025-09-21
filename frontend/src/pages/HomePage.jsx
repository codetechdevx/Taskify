import { useEffect, useState } from "react";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("list");
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "Pending",
  });

  // Fetch all tasks from your database
  const fetchTasks = () => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  // Add or update task in your database
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = selectedTask ? "PUT" : "POST";
    const url = selectedTask
      ? `http://localhost:5000/api/tasks/${selectedTask._id}`
      : "http://localhost:5000/api/tasks";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskForm),
    })
    .then((res) => res.json())
    .then(() => {
      fetchTasks();
      setView("list");
      setSelectedTask(null);
      resetForm();
    })
    .catch((err) => console.error("Error saving task:", err));
  };

  // Delete task from your database
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, { 
      method: "DELETE" 
    })
    .then(() => {
      fetchTasks();
    })
    .catch((err) => console.error("Error deleting task:", err));
  };

  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "Low",
      status: "Pending",
    });
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setTaskForm(task);
    setView("edit");
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "All" ? true : task.status === filter
  );

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High": return "badge bg-danger";
      case "Medium": return "badge bg-warning";
      case "Low": return "badge bg-success";
      default: return "badge bg-secondary";
    }
  };

  const getStatusBadge = (status) => {
    return status === "Completed" ? "badge bg-primary" : "badge bg-secondary";
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100 bg-light py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-lg border-0">
                {/* Header */}
                <div className="card-header bg-primary text-white text-center py-4">
                  <h1 className="h2 mb-2 fw-bold">Taskify</h1>
                  <p className="mb-0 opacity-75">create, manage, and track daily tasks</p>
                </div>

                <div className="card-body p-4">
                  {/* Task List View */}
                  {view === "list" && (
                    <>
                      {/* Controls */}
                      <div className="row align-items-center mb-4">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <label className="form-label me-3 mb-0 fw-semibold">Filter:</label>
                            <select
                              className="form-select"
                              style={{ width: "auto" }}
                              onChange={(e) => setFilter(e.target.value)}
                              value={filter}
                            >
                              <option>All</option>
                              <option>Pending</option>
                              <option>Completed</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                          <button
                            onClick={() => {
                              resetForm();
                              setView("new");
                            }}
                            className="btn btn-primary btn-lg"
                          >
                            <i className="bi bi-plus-circle me-2"></i>
                            Add New Task
                          </button>
                        </div>
                      </div>

                      {/* Task List */}
                      {filteredTasks.length === 0 ? (
                        <div className="text-center py-5">
                          <div className="display-1 text-muted mb-3">📝</div>
                          <h4 className="text-muted">No tasks found</h4>
                          <p className="text-muted">Create your first task to get started</p>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {filteredTasks.map((task) => (
                            <div key={task._id} className="col-12">
                              <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                  <div className="row align-items-center">
                                    <div className="col-lg-8">
                                      <h5 className="card-title fw-bold mb-2">{task.title}</h5>
                                      {task.description && (
                                        <p className="card-text text-muted mb-3">{task.description}</p>
                                      )}
                                      <div className="d-flex flex-wrap gap-2">
                                        <span className={`${getPriorityBadge(task.priority)} fs-6`}>
                                          {task.priority} Priority
                                        </span>
                                        <span className={`${getStatusBadge(task.status)} fs-6`}>
                                          {task.status}
                                        </span>
                                        {task.dueDate && (
                                          <span className="badge bg-light text-dark fs-6">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                                      <div className="btn-group">
                                        <button
                                          onClick={() => handleEdit(task)}
                                          className="btn btn-warning btn-sm me-2"
                                        >
                                          <i className="bi bi-pencil me-1"></i>
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDelete(task._id)}
                                          className="btn btn-danger btn-sm"
                                        >
                                          <i className="bi bi-trash me-1"></i>
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Form View */}
                  {(view === "new" || view === "edit") && (
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <div className="mb-4">
                          <h3 className="fw-bold">
                            {view === "new" ? "Create New Task" : "Edit Task"}
                          </h3>
                          <p className="text-muted">
                            {view === "new" 
                              ? "Fill in the details for your new task"
                              : "Update the task information below"
                            }
                          </p>
                        </div>

                        <div className="card border-0 shadow-sm">
                          <div className="card-body">
                            {/* Title */}
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Task Title *</label>
                              <input
                                type="text"
                                name="title"
                                value={taskForm.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                                className="form-control form-control-lg"
                                required
                              />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Description</label>
                              <textarea
                                name="description"
                                value={taskForm.description}
                                onChange={handleChange}
                                placeholder="Enter task description"
                                rows="4"
                                className="form-control"
                              />
                            </div>

                            {/* Due Date */}
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Due Date</label>
                              <input
                                type="date"
                                name="dueDate"
                                value={taskForm.dueDate || ""}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>

                            {/* Priority and Status */}
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label fw-semibold">Priority</label>
                                  <select
                                    name="priority"
                                    value={taskForm.priority}
                                    onChange={handleChange}
                                    className="form-select"
                                  >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                  </select>
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label fw-semibold">Status</label>
                                  <select
                                    name="status"
                                    value={taskForm.status}
                                    onChange={handleChange}
                                    className="form-select"
                                  >
                                    <option>Pending</option>
                                    <option>Completed</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Form Actions */}
                            <div className="border-top pt-3 mt-4">
                              <div className="row">
                                <div className="col-md-6 mb-2 mb-md-0">
                                  <button
                                    onClick={handleSubmit}
                                    className="btn btn-primary btn-lg w-100"
                                  >
                                    <i className="bi bi-check-circle me-2"></i>
                                    {view === "new" ? "Create Task" : "Update Task"}
                                  </button>
                                </div>
                                <div className="col-md-6">
                                  <button
                                    onClick={() => {
                                      setView("list");
                                      setSelectedTask(null);
                                      resetForm();
                                    }}
                                    className="btn btn-secondary btn-lg w-100"
                                  >
                                    <i className="bi bi-x-circle me-2"></i>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskManager;