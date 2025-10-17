const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

// Add a new task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const timeValue = timeInput.value;

  if (!text || !timeValue) {
    alert("Please enter a valid task and time limit.");
    return;
  }

  const [hours, minutes] = timeValue.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes <= 0) {
    alert("Please set a valid time limit.");
    return;
  }

  const now = Date.now();
  const task = {
    id: now,
    text,
    createdAt: now,
    expireAt: now + totalMinutes * 60000,
    expired: false,
  };

  tasks.push(task);
  displayTasks();
  startTimers(task);

  taskInput.value = "";
  timeInput.value = "";
});

// Display all tasks
function displayTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task ${task.expired ? "expired" : ""}`;

    const remaining = getRemainingTime(task);

    li.innerHTML = `
      <div>
        <span>${task.text}</span>
        <small>${task.expired ? "Expired" : `Time left: ${remaining}`}</small>
      </div>
      <div>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Calculate remaining time
function getRemainingTime(task) {
  const diff = task.expireAt - Date.now();
  if (diff <= 0) return "00:00";
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// Edit a task (text + time)
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task.expired) {
    alert("You cannot edit an expired task.");
    return;
  }

  const newText = prompt("Edit task text:", task.text);
  if (newText === null) return;

  const newTime = prompt("Edit time (HH:MM):", "00:00");
  if (newTime && /^\d{1,2}:\d{2}$/.test(newTime)) {
    const [h, m] = newTime.split(":").map(Number);
    const now = Date.now();
    task.expireAt = now + (h * 60 + m) * 60000;
    task.expired = false;
    startTimers(task);
  }

  if (newText.trim() !== "") task.text = newText.trim();

  displayTasks();
}

// Delete a task (confirmation)
function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  tasks = tasks.filter((t) => t.id !== id);
  displayTasks();
}

// Expire a task
function expireTask(task) {
  task.expired = true;
  displayTasks();
}

// Start timers (expiration + 2-min warning)
function startTimers(task) {
  const remainingMs = task.expireAt - Date.now();
  if (remainingMs <= 0) {
    expireTask(task);
    return;
  }

  // 2-minute alert
  if (remainingMs > 120000) {
    setTimeout(() => {
      if (!task.expired) {
        alert(`⏰ Reminder: Your task "${task.text}" will expire in 2 minutes!`);
      }
    }, remainingMs - 120000);
  }

  // Expire after time
  setTimeout(() => {
    if (!task.expired) {
      expireTask(task);
      alert(`❌ Task "${task.text}" has expired.`);
    }
  }, remainingMs);
}

// Refresh task display every minute
setInterval(() => displayTasks(), 60000);
