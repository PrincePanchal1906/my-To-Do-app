import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const groups = ["Work", "Personal", "Study", "Fitness", "Hobbies"];
  const [selectedGroup, setSelectedGroup] = useState("Work");
  const [tasks, setTasks] = useState([
    {
      id: 4,
      title: "Read React patterns",
      group: "Study",
      due: "Friday",
      completed: false,
      notes: "Focus on hooks and state management.",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [formState, setFormState] = useState({
    title: "",
    group: "Work",
    due: "",
    notes: "",
  });

  const groupTasks = tasks.filter(
    (task) =>
      task.group === selectedGroup &&
      task.completed === false &&
      task.isDeleted === false,
  );
  const completedCount = groupTasks.filter((task) => task.completed).length;
  const pendingCount = groupTasks.length - completedCount;

  const openAddModal = () => {
    setFormState({ title: "", group: selectedGroup, due: "", notes: "" });
    setEditTaskId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return alert("Task not found");
    setFormState({
      title: task.title,
      group: task.group,
      due: task.due,
      notes: task.notes,
    });
    setEditTaskId(task._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState({ title: "", group: selectedGroup, due: "", notes: "" });
    setEditTaskId(null);
  };
  const API =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://my-to-do-app-mx82.onrender.com";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(`${API}/api/tasks`, {
          withCredentials: true,
        });

        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const API =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://my-to-do-app-mx82.onrender.com";
    try {
      if (editTaskId) {
        // UPDATE
        const response = await axios.put(
          `${API}/api/tasks/${editTaskId}`,
          formState,
          { withCredentials: true },
        );
        const updatedTask = response.data;

        setTasks((current) =>
          current.map((task) => (task._id === editTaskId ? updatedTask : task)),
        );
      } else {
        const response = await axios.post(`${API}/api/tasks`, formState, {
          withCredentials: true,
        });

        const newTask = response.data;
        setTasks((current) => [newTask, ...current]);
      }
      closeModal();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const response = await axios.put(
        `${API}/api/tasks/${taskId}/toggle`,
        {},
        { withCredentials: true },
      );
      const updatedTask = response.data;

      setTasks((current) =>
        current.map((task) => (task._id === taskId ? updatedTask : task)),
      );
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.put(
        `${API}/api/tasks/${taskId}/delete`,
        {},
        {
          withCredentials: true,
        },
      );
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  return (
    <div className="dashboard-shell min-vh-100 py-4">
      <div className="container-fluid px-3 px-md-4">
        <nav className="navbar navbar-expand-lg navbar-dark mb-4 glass-nav shadow-sm rounded-4 px-4 py-3">
          <div className="container-fluid px-0">
            <div>
              <span className="badge bg-white text-dark opacity-85 shadow-sm mb-1">
                Task Studio
              </span>
              <h1 className="h4 text-white mb-0">Project Dashboard</h1>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-outline-light btn-sm">
                Notifications
              </button>
              <button className="btn btn-light btn-sm">Profile</button>
            </div>
          </div>
        </nav>

        <div className="row gx-4 gy-4">
          <aside className="col-12 col-xl-3">
            <div className="glass-panel p-4 rounded-4 h-100 shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <p className="text-uppercase text-secondary mb-1">Groups</p>
                  <h2 className="h5 fw-semibold text-white mb-0">
                    Task Collections
                  </h2>
                </div>
                <span className="badge bg-info bg-opacity-25 text-info">
                  {groups.length}
                </span>
              </div>

              <div className="list-group mb-4 group-list">
                {groups.map((group) => {
                  const count = tasks.filter(
                    (task) =>
                      task.group === group &&
                      task.isDeleted === false &&
                      task.completed === false,
                  ).length;
                  return (
                    <button
                      key={group}
                      type="button"
                      className={`list-group-item list-group-item-action rounded-4 mb-2 ${selectedGroup === group ? "active" : "bg-white bg-opacity-10 text-white"}`}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{group}</span>
                        <span className="badge rounded-pill bg-white text-dark">
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="stats glass-stat p-3 rounded-4">
                <p className="text-secondary mb-2">Current group</p>
                <h3 className="h6 text-white mb-3">{selectedGroup}</h3>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge bg-success">
                    {completedCount} Completed
                  </span>
                  <span className="badge bg-warning text-dark">
                    {pendingCount} Pending
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <main className="col-12 col-xl-9">
            <div className="glass-panel p-4 rounded-4 shadow-sm">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                  <p className="text-secondary mb-1">{selectedGroup} tasks</p>
                  <h2 className="h4 text-white mb-0">Your workflow overview</h2>
                </div>
                <button
                  className="btn btn-primary btn-lg shadow-sm"
                  onClick={openAddModal}
                >
                  Add task
                </button>
              </div>

              <div className="row gx-3 gy-3 mb-4">
                <div className="col-6 col-md-4">
                  <div className="summary-card rounded-4 p-3">
                    <p className="text-secondary mb-2">Total</p>
                    <h3 className="text-white mb-0">{groupTasks.length}</h3>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="summary-card rounded-4 p-3">
                    <p className="text-secondary mb-2">Completed</p>
                    <h3 className="text-white mb-0">{completedCount}</h3>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="summary-card rounded-4 p-3">
                    <p className="text-secondary mb-2">Pending</p>
                    <h3 className="text-white mb-0">{pendingCount}</h3>
                  </div>
                </div>
              </div>

              {groupTasks.length === 0 ? (
                <div className="empty-state rounded-4 p-5 text-center">
                  <div className="mb-3 display-6 text-white opacity-75">✨</div>
                  <h3 className="text-white mb-2">No tasks here yet</h3>
                  <p className="text-secondary mb-4">
                    Add a new task to get started with your{" "}
                    {selectedGroup.toLowerCase()} collection.
                  </p>
                  <button
                    className="btn btn-outline-light"
                    onClick={openAddModal}
                  >
                    Create first task
                  </button>
                </div>
              ) : (
                <div className="task-grid row gx-3 gy-3">
                  {groupTasks.map((task) => (
                    <div className="col-12" key={task._id}>
                      <div
                        className={`task-card p-3 rounded-4 ${task.completed ? "completed" : ""}`}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div>
                            <h3 className="h5 mb-2 text-white">{task.title}</h3>
                            <p className="text-secondary mb-2">{task.notes}</p>
                            <div className="d-flex flex-wrap gap-2">
                              <span className="badge bg-light text-dark">
                                {task.due}
                              </span>
                              <span
                                className={`badge ${task.completed ? "bg-success" : "bg-warning text-dark"}`}
                              >
                                {task.completed ? "Completed" : "Pending"}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex flex-column gap-2 text-end">
                            <button
                              className="btn btn-sm btn-outline-light"
                              onClick={() => toggleComplete(task._id)}
                            >
                              {task.completed ? "Undo" : "Complete"}
                            </button>
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => openEditModal(task._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteTask(task._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <div
        className={`modal-backdrop ${isModalOpen ? "show" : ""}`}
        onClick={closeModal}
      />
      <div className={`modal-panel ${isModalOpen ? "show" : ""}`}>
        <div className="glass-panel rounded-4 p-4 shadow-lg modal-content-panel">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="h5 mb-1 text-white">
                {editTaskId ? "Edit task" : "Add new task"}
              </h2>
              <p className="text-secondary mb-0">
                Organize your work in a clean, focused view.
              </p>
            </div>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={closeModal}
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white">Task title</label>
              <input
                className="form-control form-control-dark"
                value={formState.title}
                onChange={(event) =>
                  setFormState({ ...formState, title: event.target.value })
                }
                placeholder="E.g. Prepare sprint review"
                required
              />
            </div>

            <div className="row gx-3">
              <div className="col-12 col-md-6 mb-3 ">
                <label className="form-label text-white">Group</label>
                <select
                  className="form-select form-select-dark "
                  value={formState.group}
                  onChange={(event) =>
                    setFormState({ ...formState, group: event.target.value })
                  }
                >
                  {groups.map((group) => (
                    <option
                      key={group}
                      value={group}
                      className="bg-dark bg-opacity-100 text-transparent"
                    >
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label text-white">Due</label>
                <input
                  className="form-control form-control-dark"
                  value={formState.due}
                  onChange={(event) =>
                    setFormState({ ...formState, due: event.target.value })
                  }
                  placeholder="Today, Tomorrow, Friday"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-white">Notes</label>
              <textarea
                className="form-control form-control-dark"
                rows="3"
                value={formState.notes}
                onChange={(event) =>
                  setFormState({ ...formState, notes: event.target.value })
                }
                placeholder="Add supplementary description"
              />
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onChange={handleSubmit}
              >
                {editTaskId ? "Save changes" : "Create task"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .dashboard-shell {
          background: radial-gradient(circle at top left, rgba(137, 195, 255, 0.22), transparent 32%),
            radial-gradient(circle at bottom right, rgba(132, 94, 255, 0.18), transparent 28%),
            linear-gradient(180deg, #08101f 0%, #0f1a2e 100%);
          min-height: 100vh;
          color: #fff;
          overflow-x: hidden;
        }

        .glass-nav,
        .glass-panel,
        .stats,
        .summary-card,
        .empty-state,
        .task-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(18px);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .glass-nav:hover,
        .glass-panel:hover,
        .summary-card:hover,
        .task-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.24);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.14);
        }

        .group-list button {
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .group-list button:hover {
          transform: translateX(4px);
        }

        .task-card.completed {
          opacity: 0.75;
          border-color: rgba(52, 211, 153, 0.4);
          background: rgba(52, 211, 153, 0.08);
        }

        .task-card button {
          min-width: 90px;
        }

        .summary-card {
          padding: 1.25rem;
        }

        .summary-card p {
          margin-bottom: 0.5rem;
        }

        .empty-state {
          border: 1px dashed rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.05);
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 12, 28, 0.7);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease;
          z-index: 1040;
        }

        .modal-backdrop.show {
          opacity: 1;
          visibility: visible;
        }

        .modal-panel {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
          transform: translateY(20px);
          z-index: 1050;
        }

        .modal-panel.show {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
        }

        .modal-content-panel {
          max-width: 650px;
          width: 100%;
        }

        .form-control-dark,
        .form-select-dark,
        .form-control-dark:focus,
        .form-select-dark:focus {
          background: rgba(255, 255, 255, 0.06);
          color: #f8f9fa;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: none;
        }

        .form-control-dark::placeholder,
        .form-select-dark option {
          color: rgba(248, 249, 250, 0.65);
        }

        .form-control-dark:focus,
        .form-select-dark:focus {
          border-color: rgba(13, 110, 253, 0.8);
        }

        .glass-stat {
          background: rgba(255, 255, 255, 0.06);
        }

        @media (max-width: 767px) {
          .task-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
