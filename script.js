const taskInput = document.getElementById("taskInput");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

// Add a new task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;

  const totalMinutes = hours * 60 + minutes;

  if (!text || totalMinutes <= 0) {
    alert("Please enter a valid task and time limit.");
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

  // Clear inputs
  taskInput.value = "";
  hoursInput.value = "";
  minutesInput.value = "";
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

// Helper to calculate remaining time
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

  const newHours = prompt("Edit hours (leave blank to keep current):");
  const newMinutes = prompt("Edit minutes (leave blank to keep current):");

  if (newText.trim() !== "") task.text = newText.trim();

  const hrs = newHours === "" ? 0 : parseInt(newHours) || 0;
  const mins = newMinutes === "" ? 0 : parseInt(newMinutes) || 0;

  if (hrs > 0 || mins > 0) {
    const now = Date.now();
    task.createdAt = now;
    task.expireAt = now + (hrs * 60 + mins) * 60000;
    task.expired = false;
    startTimers(task);
  }

  displayTasks();
}

// Delete a task (with confirmation)
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

// Start timers for expiration + 2-min warning
function startTimers(task) {
  const remainingMs = task.expireAt - Date.now();
  if (remainingMs <= 0) {
    expireTask(task);
    return;
  }

  // Alert 2 minutes before expiration
  if (remainingMs > 120000) {
    setTimeout(() => {
      if (!task.expired) {
        alert(`⏰ Reminder: Your task "${task.text}" will expire in 2 minutes!`);
      }
    }, remainingMs - 120000);
  }

  // Expire after time is up
  setTimeout(() => {
    if (!task.expired) {
      expireTask(task);
      alert(`❌ Task "${task.text}" has expired.`);
    }
  }, remainingMs);
}

// Update display every minute
setInterval(() => displayTasks(), 60000);
