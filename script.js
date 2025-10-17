const taskInput = document.getElementById("taskInput");
const datetimeInput = document.getElementById("datetimeInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

// Add a new task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const datetimeValue = datetimeInput.value;

  if (!text || !datetimeValue) {
    alert("Please enter both a task and a valid date/time.");
    return;
  }

  const dueTime = new Date(datetimeValue);
  if (isNaN(dueTime.getTime())) {
    alert("Invalid date/time format.");
    return;
  }

  const task = {
    id: Date.now(),
    text,
    time: dueTime,
    expired: false,
    alertShown: false,
  };

  tasks.push(task);
  displayTasks();

  taskInput.value = "";
  datetimeInput.value = "";
});

// Display tasks
function displayTasks() {
  taskList.innerHTML = "";
  const now = new Date();

  tasks.forEach((task) => {
    // Expire if time passed
    if (!task.expired && now >= task.time) {
      task.expired = true;
      alert(`Task "${task.text}" has expired!`);
    }

    const li = document.createElement("li");
    li.className = `task ${task.expired ? "expired" : ""}`;

    const timeStr = task.time.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    li.innerHTML = `
      <span>${task.text} — <small>${timeStr}</small></span>
      <div>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Edit a task and its datetime
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task.expired) {
    alert("You cannot edit an expired task.");
    return;
  }

  const newText = prompt("Edit task:", task.text);
  if (newText === null || newText.trim() === "") return;

  const newDateTime = prompt(
    "Edit date and time (YYYY-MM-DDTHH:MM):",
    task.time.toISOString().slice(0, 16)
  );

  const updatedTime = new Date(newDateTime);
  if (isNaN(updatedTime.getTime())) {
    alert("Invalid datetime format. Use format like 2025-10-17T09:00");
    return;
  }

  task.text = newText.trim();
  task.time = updatedTime;
  task.alertShown = false;
  displayTasks();
}

// Delete task with confirmation
function deleteTask(id) {
  const task = tasks.find((t) => t.id === id);
  const confirmDelete = confirm(`Are you sure you want to delete "${task.text}"?`);
  if (confirmDelete) {
    tasks = tasks.filter((t) => t.id !== id);
    displayTasks();
  }
}

// Check for alerts and expiry every 30 seconds
setInterval(() => {
  const now = new Date();

  tasks.forEach((task) => {
    const diff = task.time - now;

    if (!task.expired && diff <= 0) {
      task.expired = true;
      alert(`Task "${task.text}" has expired!`);
    } else if (!task.alertShown && diff > 0 && diff <= 2 * 60 * 1000) {
      task.alertShown = true;
      alert(`Task "${task.text}" will expire in 2 minutes!`);
    }
  });

  displayTasks();
}, 30000);
