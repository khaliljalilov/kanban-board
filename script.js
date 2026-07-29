document.getElementById("nav_selector").addEventListener("change", function () {
  document.getElementById("filter-dot").className = `dot dot--${this.value}`;
});

let tasks = [
  { id: 1, title: "Layihə strukturunu qur", priority: "high", column: "todo" },
  { id: 2, title: "HTML skeletini yaz", priority: "high", column: "todo" },
  {
    id: 3,
    title: "CSS stilləri əlavə et",
    priority: "medium",
    column: "inprogress",
  },
  { id: 4, title: "JS ilə render et", priority: "high", column: "inprogress" },
  { id: 5, title: "README yaz", priority: "low", column: "done" },
];

function createCard(task) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = task.id;

  const title = document.createElement("p");
  title.className = "card__title";
  title.textContent = task.title;

  const badge = document.createElement("span");
  badge.className = `card__priority card__priority--${task.priority}`;
  badge.textContent =
    task.priority === "high"
      ? "Çətin"
      : task.priority === "medium"
        ? "Orta"
        : "Aşağı";

  // Düymələr
  const actions = document.createElement("div");
  actions.className = "card__actions";

  const editBtn = document.createElement("button");
  editBtn.className = "card__btn card__btn--edit";
  editBtn.textContent = "✏️";
  editBtn.dataset.id = task.id;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "card__btn card__btn--delete";
  deleteBtn.textContent = "🗑️";
  deleteBtn.dataset.id = task.id;

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(title);
  card.appendChild(badge);
  card.appendChild(actions);

  return card;
}

function renderBoard() {
  const columns = ["todo", "inprogress", "done"];

  // Əvvəlcə hər sütunu təmizlə
  columns.forEach((col) => {
    document.getElementById(`cards-${col}`).innerHTML = "";
  });

  tasks.forEach((task) => {
    const container = document.getElementById(`cards-${task.column}`);
    if (!container) return;
    container.appendChild(createCard(task));
  });

  columns.forEach((col) => {
    const count = tasks.filter((t) => t.column === col).length;
    document.getElementById(`count-${col}`).textContent = count;
  });
}

document.addEventListener("DOMContentLoaded", renderBoard);

document.getElementById("new-task").addEventListener("click", function () {
  document.getElementById("modal").classList.add("is-open");
});

document.getElementById("modal-close").addEventListener("click", function () {
  document.getElementById("modal").classList.remove("is-open");
});

document.getElementById("modal-cancel").addEventListener("click", function () {
  document.getElementById("modal").classList.remove("is-open");
});
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === this) {
    this.classList.remove("is-open");
  }
});

document.getElementById("modal-save").addEventListener("click", function () {
  const title = document.getElementById("task-title").value;
  const priority = document.getElementById("task-priority").value;
  const column = document.getElementById("task-column").value;

  tasks.push({
    id: tasks[tasks.length - 1].id + 1,
    title: title,
    priority: priority,
    column: column,
  });

  document.getElementById("modal").classList.remove("is-open");
  renderBoard();
});

document.getElementById("board").addEventListener("click", function (e) {
  if (e.target.classList.contains("card__btn--delete")) {
    const id = e.target.dataset.id;
    tasks = tasks.filter((t) => t.id !== Number(id));
    renderBoard();
  }
});
let editingId = null;
document.getElementById("board").addEventListener("click", function (e) {
  if (e.target.classList.contains("card__btn--edit")) {
    const id = e.target.dataset.id;
    const task = tasks.find((u) => u.id === Number(id));

    // modalın inputlarını doldur
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-priority").value = task.priority;
    document.getElementById("task-column").value = task.column;

    editingId = Number(id);
    document.getElementById("modal").classList.add("is-open");
  }
});


document.getElementById("modal-save").addEventListener("click", function () {
    const title = document.getElementById("task-title").value;
    const priority = document.getElementById("task-priority").value;
    const column = document.getElementById("task-column").value;

    if (editingId !== null) {
        // Redaktə rejimi — tapıb yenilə
        const task = tasks.find(t => t.id === editingId);
        task.title = title;
        task.priority = priority;
        task.column = column;
        editingId = null; // sıfırla
    } else {
        // Yeni tapşırıq
        tasks.push({
            id: tasks[tasks.length - 1].id + 1,
            title: title,
            priority: priority,
            column: column,
        });
    }

    document.getElementById("modal").classList.remove("is-open");
    renderBoard();
});