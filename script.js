"use strict";

// ========================
// State
// ========================
let tasks = [];
let editingId = null;
let draggedId = null;

// ========================
// localStorage
// ========================
function saveToStorage() {
  localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
}

function loadFromStorage() {
  const saved = localStorage.getItem("kanban-tasks");
  if (saved) tasks = JSON.parse(saved);
}
// ========================
// filter
// ========================
function getFilteredTasks() {
  const keyword = document.getElementById("nav_selector_search")
    ? document.getElementById("nav_selector_search").value.toLowerCase()
    : document.querySelector(".nav__searching").value.toLowerCase();
  const priority = document.getElementById("nav_selector").value;

  return tasks.filter((task) => {
    const matchesKeyword = task.title.toLowerCase().includes(keyword);
    const matchesPriority = priority === "all" || task.priority === priority;
    return matchesKeyword && matchesPriority;
  });
}

// ========================
// Render
// ========================
function createCard(task) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = task.id;
  card.setAttribute("draggable", true);

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
  const filtered = getFilteredTasks();

  columns.forEach((col) => {
    document.getElementById(`cards-${col}`).innerHTML = "";
  });

  filtered.forEach((task) => {
    const container = document.getElementById(`cards-${task.column}`);
    if (!container) return;
    container.appendChild(createCard(task));
  });

  columns.forEach((col) => {
    const count = filtered.filter((t) => t.column === col).length;
    document.getElementById(`count-${col}`).textContent = count;
  });

  saveToStorage();
}

// ========================
// Modal
// ========================
function openModal() {
  document.getElementById("modal").classList.add("is-open");
}

function closeModal() {
  document.getElementById("modal").classList.remove("is-open");
  document.getElementById("task-title").value = "";
  editingId = null;
}

// ========================
// Drag and Drop
// ========================
function initDragAndDrop() {
  document.getElementById("board").addEventListener("dragstart", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;
    draggedId = Number(card.dataset.id);
    card.classList.add("is-dragging");
  });

  document.getElementById("board").addEventListener("dragend", function (e) {
    const card = e.target.closest(".card");
    if (!card) return;
    card.classList.remove("is-dragging");
  });

  document.querySelectorAll(".board__cards").forEach((col) => {
    col.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("drag-over");
    });

    col.addEventListener("dragleave", function () {
      this.classList.remove("drag-over");
    });

    col.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");
      const newColumn = this.id.replace("cards-", "");
      const task = tasks.find((t) => t.id === draggedId);
      if (task) {
        task.column = newColumn;
        renderBoard();
      }
      draggedId = null;
    });
  });
}

// ========================
// Event Listeners
// ========================
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  renderBoard();
  initDragAndDrop();
  document
    .querySelector(".nav__searching")
    .addEventListener("input", renderBoard); 
});

// Filter dot
document.getElementById("nav_selector").addEventListener("change", function () {
  document.getElementById("filter-dot").className = `dot dot--${this.value}`;
  renderBoard();
});

// Modal aç/bağla
document.getElementById("new-task").addEventListener("click", openModal);
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-cancel").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});

// Saxla
document.getElementById("modal-save").addEventListener("click", function () {
  const title = document.getElementById("task-title").value.trim();
  const priority = document.getElementById("task-priority").value;
  const column = document.getElementById("task-column").value;

  if (!title) return;

  if (editingId !== null) {
    const task = tasks.find((t) => t.id === editingId);
    task.title = title;
    task.priority = priority;
    task.column = column;
  } else {
    tasks.push({
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      title,
      priority,
      column,
    });
  }

  closeModal();
  renderBoard();
});

// Sil / Redaktə et
document.getElementById("board").addEventListener("click", function (e) {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("card__btn--delete")) {
    tasks = tasks.filter((t) => t.id !== id);
    renderBoard();
  }

  if (e.target.classList.contains("card__btn--edit")) {
    const task = tasks.find((t) => t.id === id);
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-priority").value = task.priority;
    document.getElementById("task-column").value = task.column;
    editingId = id;
    openModal();
  }
});

