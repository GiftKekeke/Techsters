/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background-color: #f9f9f9;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 90%;
  max-width: 500px;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #ffb6c1; /* Baby pink */
  margin-bottom: 20px;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-section input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
}

#addTaskBtn {
  background-color: #ffb6c1;
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

#addTaskBtn:hover {
  background-color: #f49dad;
}

ul {
  list-style-type: none;
}

.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f0f0; /* Ash color */
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background 0.3s;
}

.task.expired {
  background: #ffd6d6;
  text-decoration: line-through;
  color: #888;
}

.task button {
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: 5px;
  font-size: 14px;
  color: #333;
}

.task button:hover {
  color: #ff69b4;
}

@media (max-width: 600px) {
  .input-section {
    flex-direction: column;
  }

  #addTaskBtn {
    width: 100%;
  }
}
