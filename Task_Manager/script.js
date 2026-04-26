const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const storageKey = "taskManagerTasks";

function updateEmptyState() {
  emptyState.style.display = taskList.children.length === 0 ? "block" : "none";
}

function syncTaskState(taskItem) {
  const completeButton = taskItem.querySelector(".complete-button");
  const editButton = taskItem.querySelector(".edit-button");
  const isCompleted = taskItem.classList.contains("completed");

  completeButton.textContent = isCompleted ? "Completed" : "Complete";
  editButton.disabled = isCompleted;
}

function saveTasks() {
  const tasks = Array.from(taskList.children).map((taskItem) => {
    const taskContent = taskItem.querySelector(".task-content");

    return {
      text: taskContent.textContent,
      completed: taskItem.classList.contains("completed")
    };
  });

  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem(storageKey)) || [];

  savedTasks.forEach((task) => {
    const taskItem = createTaskItem(task.text, task.completed);
    taskList.appendChild(taskItem);
  });

  updateEmptyState();
}

function createTaskItem(taskText, isCompleted = false) {
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";

  if (isCompleted) {
    taskItem.classList.add("completed");
  }

  const taskContent = document.createElement("span");
  taskContent.className = "task-content";
  taskContent.textContent = taskText;

  const taskActions = document.createElement("div");
  taskActions.className = "task-actions";

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.className = "complete-button";
  completeButton.textContent = isCompleted ? "Completed" : "Complete";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-button";
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";

  taskActions.appendChild(completeButton);
  taskActions.appendChild(editButton);
  taskActions.appendChild(deleteButton);

  taskItem.appendChild(taskContent);
  taskItem.appendChild(taskActions);
  syncTaskState(taskItem);

  return taskItem;
}

function handleAddTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) {
    return;
  }

  const newTaskItem = createTaskItem(taskText);
  taskList.appendChild(newTaskItem);

  taskInput.value = "";
  updateEmptyState();
  saveTasks();
}

function handleTaskAction(event) {
  const clickedButton = event.target.closest("button");

  if (!clickedButton) {
    return;
  }

  const taskItem = clickedButton.closest(".task-item");
  const taskContent = taskItem.querySelector(".task-content");

  if (clickedButton.classList.contains("complete-button")) {
    taskItem.classList.toggle("completed");
    syncTaskState(taskItem);
    saveTasks();
  }

  if (clickedButton.classList.contains("edit-button")) {
    if (clickedButton.disabled) {
      return;
    }

    const updatedTask = prompt("Edit your task:", taskContent.textContent);

    if (updatedTask !== null && updatedTask.trim() !== "") {
      taskContent.textContent = updatedTask.trim();
      saveTasks();
    }
  }

  if (clickedButton.classList.contains("delete-button")) {
    taskItem.remove();
    updateEmptyState();
    saveTasks();
  }
}

addTaskButton.addEventListener("click", handleAddTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAddTask();
  }
});
taskList.addEventListener("click", handleTaskAction);

loadTasks();
