const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

// Add task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const timeValue = timeInput.value;

  if (!text || !timeValue) {
    alert("Please enter both a task and a valid time.");
    return;
  }

  const [hours, minutes] = timeValue.split(":").map(Number);
  const now = new Date();
  const dueTime = new Date();

  // ✅ Handle midnight (00:00) correctly
  dueTime.setHours(hours, minutes, 0, 0);
  if (dueTime <= now) {
    dueTime.setDate(dueTime.getDate() + 1);
  }

  const task = {
    id: Date.now(),
    text,
    time: dueTime,
    expired: false,
    alertShown: false
  };

  tasks.push(task);
  displayTasks();

  taskInput.value = "";
  timeInput.value = "";
});

// Display tasks
function displayTasks() {
  taskList.innerHTML = "";
  const now = new Date();

  tasks.forEach((task) => {
    if (!task.expired && now >= task.time) {
      task.expired = true;
      alert(`Task "${task.text}" has expired!`);
    }

    const li = document.createElement("li");
    li.className = `task ${task.expired ? "expired" : ""}`;

    const timeStr = task.time.toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
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

// Edit task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task.expired) {
    alert("You cannot edit an expired task.");
    return;
  }

  const newText = prompt("Edit task:", task.text);
  if (newText === null || newText.trim() === "") return;

  const newTime = prompt("Edit time (HH:MM, 24-hour format):", task.time.toTimeString().slice(0, 5));
  if (!/^\d{2}:\d{2}$/.test(newTime)) {
    alert("Invalid time format.");
    return;
  }

  const [h, m] = newTime.split(":").map(Number);
  const updatedTime = new Date();
  updatedTime.setHours(h, m, 0, 0);

  // ✅ Handle 00:00 and next-day rollover
  if (updatedTime <= new Date()) {
    updatedTime.setDate(updatedTime.getDate() + 1);
  }

  task.text = newText.trim();
  task.time = updatedTime;
  displayTasks();
}

// Delete task
function deleteTask(id) {
  const task = tasks.find((t) => t.id === id);
  const confirmDelete = confirm(`Are you sure you want to delete "${task.text}"?`);
  if (confirmDelete) {
    tasks = tasks.filter((t) => t.id !== id);
    displayTasks();
  }
}

// Check alerts & expirations every 30s
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
