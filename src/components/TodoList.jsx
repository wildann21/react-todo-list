import { useState, useEffect } from "react";
import "./TodoList.css";

const TodoList = () => {
  // Menyimpan data tugas dari localStorage
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem("todos");
      if (!savedTodos) return [];

      const parsedTodos = JSON.parse(savedTodos);
      return Array.isArray(parsedTodos) ? parsedTodos : [];
    } catch (error) {
      console.error("Gagal membaca todos:", error);
      return [];
    }
  });

  // Menyimpan data input
  const [input, setInput] = useState("");

  // Menyimpan filter yang dipilih
  const [filter, setFilter] = useState("all");

  // Menghitung jumlah tugas
  const totalTasks = todos.length;
  const activeTasks = todos.filter((todo) => !todo.completed).length;
  const completedTasks = todos.filter((todo) => todo.completed).length;

  // Menambahkan tugas
  const handleSubmit = (e) => {
    e.preventDefault();

    const title = input.trim();
    if (!title) return;

    const newTodo = {
      id: Date.now(),
      title: title,
      completed: false,
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setInput("");
  };

  // Menghapus tugas
  const handleDelete = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  // Mengubah status tugas
  const handleToggle = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Memfilter tugas
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Menyimpan perubahan todos ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Gagal menyimpan todos:", error);
    }
  }, [todos]);

  return (
    <main className="todo-page">
      <section className="todo-app">
        {/* Header */}
        <header className="todo-header">
          <p className="todo-eyebrow">DAILY PLANNER</p>
          <h1 className="todo-heading">My Todo List</h1>
          <p className="todo-subtitle">
            Organize your day, one task at a time.
          </p>
        </header>

        {/* Task Statistics */}
        <section className="todo-stats">
          <article className="todo-stat-card stat-total">
            <span className="todo-stat-label">Total Tasks</span>
            <strong className="todo-stat-value">{totalTasks}</strong>
          </article>

          <article className="todo-stat-card stat-active">
            <span className="todo-stat-label">Active</span>
            <strong className="todo-stat-value">{activeTasks}</strong>
          </article>

          <article className="todo-stat-card stat-completed">
            <span className="todo-stat-label">Completed</span>
            <strong className="todo-stat-value">{completedTasks}</strong>
          </article>
        </section>

        {/* Add Task Form */}
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            className="todo-input"
            type="text"
            value={input}
            placeholder="Tulis tugas baru..."
            onChange={(e) => setInput(e.target.value)}
            aria-label="Nama tugas baru"
          />

          <button
            className="todo-add-button"
            type="submit"
            disabled={!input.trim()}
          >
            <span aria-hidden="true">+</span>
            Tambah Tugas
          </button>
        </form>

        {/* Filter Buttons */}
        <section className="todo-list-section">
          <div className="todo-section-heading">
            <div>
              <h2>My Tasks</h2>
              <p>Manage your daily activities.</p>
            </div>

            <span className="todo-count">{filteredTodos.length} tasks</span>
          </div>

          <div className="todo-filters" role="group" aria-label="Filter tugas">
            <button
              type="button"
              className={`todo-filter ${filter === "all" ? "is-active" : ""}`}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              type="button"
              className={`todo-filter ${filter === "active" ? "is-active" : ""}`}
              aria-pressed={filter === "active"}
              onClick={() => setFilter("active")}
            >
              Active
            </button>

            <button
              type="button"
              className={`todo-filter ${filter === "completed" ? "is-active" : ""}`}
              aria-pressed={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          {/* Todo List / Empty State */}
          {filteredTodos.length === 0 ? (
            <div className="todo-empty">
              <div className="todo-empty-icon" aria-hidden="true">
                ✓
              </div>

              <h3>
                {todos.length === 0
                  ? "Belum ada tugas"
                  : "Tidak ada tugas di sini"}
              </h3>

              <p>
                {todos.length === 0
                  ? "Tambahkan tugas pertamamu untuk memulai."
                  : "Coba pilih filter yang berbeda."}
              </p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li
                  className={`todo-item ${todo.completed ? "is-completed" : ""}`}
                  key={todo.id}
                >
                  <div className="todo-item-content">
                    <input
                      className="todo-checkbox"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id)}
                      aria-label={`Tandai ${todo.title} sebagai selesai`}
                    />

                    <span
                      className={`todo-item-title ${todo.completed ? "is-completed" : ""}`}
                    >
                      {todo.title}
                    </span>
                  </div>

                  <button
                    className="todo-delete-button"
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    aria-label={`Hapus ${todo.title}`}
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer */}
        <footer className="todo-footer">
          <span>Small steps, big progress.</span>
          <span>{activeTasks} remaining</span>
        </footer>
      </section>
    </main>
  );
};

export default TodoList;
