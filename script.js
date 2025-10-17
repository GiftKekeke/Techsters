const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

// Add a task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const minutes = parseInt(timeInput.value);

  if (!text || isNaN(minutes) || minutes <= 0) {
    alert("Please enter a valid task and time limit (in minutes).");
    return;
  }

  const task = {
    id: Date.now(),
    text,
    expired: false,
  };

  tasks.push(task);
  displayTasks();

  // Clear inputs
  taskInput.value = "";
  timeInput.value = "";

  // Expire automatically
  setTimeout(() => expireTask(task.id), minutes * 60000);
});

// Display all tasks
function displayTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task ${task.expired ? "expired" : ""}`;
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Edit a task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    displayTasks();
  }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  displayTasks();
}

// Expire a task
function expireTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task && !task.expired) {
    task.expired = true;
    displayTasks();
  }
}
