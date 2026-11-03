import { useState, useEffect } from "react";
import "./TodoList.css";

const TodoList = () => {
  // Menyimpan dan mengambil data tugas
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem("todos");

      if (!savedTodos) return [];

      const parsedTodos = JSON.parse(savedTodos);

      return Array.isArray(parsedTodos) ? parsedTodos : [];
    } catch (error) {
      console.error("Gagal membaca data tugas:", error);
      return [];
    }
  });

  // Menyimpan teks yang diketik pengguna
  const [input, setInput] = useState("");

  // Menyimpan pilihan filter
  const [filter, setFilter] = useState("all");

  // Menghitung jumlah tugas
  const totalTasks = todos.length;
  const activeTasks = todos.filter((todo) => !todo.completed).length;
  const completedTasks = todos.filter((todo) => todo.completed).length;

  // Menambahkan tugas baru
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

  // Mengubah status penyelesaian tugas
  const handleToggle = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Memfilter tugas sesuai pilihan pengguna
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;

    return true;
  });

  // Menyimpan perubahan data ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Gagal menyimpan data tugas:", error);
    }
  }, [todos]);

  return (
    <main className="todo-page">
      <section className="todo-app">
        {/* Header */}
        <header className="todo-header">
          <p className="todo-eyebrow">PERENCANAAN HARIAN</p>

          <h1 className="todo-heading">Daftar Tugasku</h1>

          <p className="todo-subtitle">
            Kelola tugas harianmu dengan lebih mudah.
          </p>
        </header>

        {/* Ringkasan Tugas */}
        <section className="todo-stats">
          <article className="todo-stat-card stat-total">
            <span className="todo-stat-label">Total Tugas</span>
            <strong className="todo-stat-value">{totalTasks}</strong>
          </article>

          <article className="todo-stat-card stat-active">
            <span className="todo-stat-label">Belum Selesai</span>
            <strong className="todo-stat-value">{activeTasks}</strong>
          </article>

          <article className="todo-stat-card stat-completed">
            <span className="todo-stat-label">Sudah Selesai</span>
            <strong className="todo-stat-value">{completedTasks}</strong>
          </article>
        </section>

        {/* Form Tambah Tugas */}
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            className="todo-input"
            type="text"
            value={input}
            placeholder="Tulis tugas yang ingin kamu selesaikan..."
            onChange={(e) => setInput(e.target.value)}
            aria-label="Tulis tugas baru"
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

        {/* Daftar Tugas */}
        <section className="todo-list-section">
          <div className="todo-section-heading">
            <div>
              <h2>Daftar Tugas</h2>
              <p>Pantau dan kelola semua tugasmu di sini.</p>
            </div>

            <span className="todo-count">{filteredTodos.length} tugas</span>
          </div>

          {/* Filter Tugas */}
          <div
            className="todo-filters"
            role="group"
            aria-label="Filter daftar tugas"
          >
            <button
              type="button"
              className={`todo-filter ${filter === "all" ? "is-active" : ""}`}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Semua
            </button>

            <button
              type="button"
              className={`todo-filter ${filter === "active" ? "is-active" : ""}`}
              aria-pressed={filter === "active"}
              onClick={() => setFilter("active")}
            >
              Belum Selesai
            </button>

            <button
              type="button"
              className={`todo-filter ${filter === "completed" ? "is-active" : ""}`}
              aria-pressed={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              Sudah Selesai
            </button>
          </div>

          {/* Empty State atau Daftar Tugas */}
          {filteredTodos.length === 0 ? (
            <div className="todo-empty">
              <div className="todo-empty-icon" aria-hidden="true">
                ✓
              </div>

              <h3>
                {todos.length === 0
                  ? "Belum ada tugas"
                  : "Tidak ada tugas yang cocok"}
              </h3>

              <p>
                {todos.length === 0
                  ? "Tambahkan tugas pertamamu untuk mulai mengatur aktivitas."
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
                      aria-label={
                        todo.completed
                          ? `Tandai ${todo.title} sebagai belum selesai`
                          : `Tandai ${todo.title} sebagai selesai`
                      }
                    />

                    <span
                      className={`todo-item-title ${
                        todo.completed ? "is-completed" : ""
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>

                  <button
                    className="todo-delete-button"
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    aria-label={`Hapus tugas ${todo.title}`}
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
          <span>Langkah kecil, kemajuan besar.</span>
          <span>{activeTasks} tugas tersisa</span>
        </footer>
      </section>
    </main>
  );
};

export default TodoList;
