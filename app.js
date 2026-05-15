const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");
const thermometer = document.querySelector(".thermometer");
const thermometerFill = document.getElementById("thermometerFill");

const tasks = [];

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function calculateTaskCompletion(task) {
  if (task.subtasks.length === 0) {
    return task.completed ? 1 : 0;
  }

  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
  return completedSubtasks / task.subtasks.length;
}

function updateProgress() {
  if (tasks.length === 0) {
    progressText.textContent = "0% complete";
    thermometerFill.style.width = "0%";
    thermometer.setAttribute("aria-valuenow", "0");
    return;
  }

  const totalProgress = tasks.reduce((sum, task) => sum + calculateTaskCompletion(task), 0);
  const percentage = Math.round((totalProgress / tasks.length) * 100);

  progressText.textContent = `${percentage}% complete`;
  thermometerFill.style.width = `${percentage}%`;
  thermometer.setAttribute("aria-valuenow", String(percentage));
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    const heading = document.createElement("div");
    heading.className = "heading";

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = task.completed;
    taskCheckbox.addEventListener("change", () => {
      task.completed = taskCheckbox.checked;
      task.subtasks.forEach((subtask) => {
        subtask.completed = task.completed;
      });
      render();
    });

    const label = document.createElement("span");
    label.textContent = task.text;

    heading.append(taskCheckbox, label);
    taskItem.appendChild(heading);

    const subtasks = document.createElement("ul");
    subtasks.className = "subtasks";

    task.subtasks.forEach((subtask) => {
      const subtaskItem = document.createElement("li");

      const subtaskCheckbox = document.createElement("input");
      subtaskCheckbox.type = "checkbox";
      subtaskCheckbox.checked = subtask.completed;
      subtaskCheckbox.addEventListener("change", () => {
        subtask.completed = subtaskCheckbox.checked;
        task.completed = task.subtasks.length > 0 && task.subtasks.every((entry) => entry.completed);
        render();
      });

      const subtaskLabel = document.createElement("span");
      subtaskLabel.textContent = subtask.text;

      subtaskItem.append(subtaskCheckbox, subtaskLabel);
      subtasks.appendChild(subtaskItem);
    });

    taskItem.appendChild(subtasks);

    const subtaskForm = document.createElement("form");
    subtaskForm.className = "subtask-form";
    const subtaskRow = document.createElement("div");
    subtaskRow.className = "row";
    const subtaskInput = document.createElement("input");
    subtaskInput.type = "text";
    subtaskInput.placeholder = "Add subtask";
    subtaskInput.required = true;

    const subtaskButton = document.createElement("button");
    subtaskButton.type = "submit";
    subtaskButton.textContent = "Add subtask";

    subtaskRow.append(subtaskInput, subtaskButton);
    subtaskForm.appendChild(subtaskRow);

    subtaskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = subtaskInput.value.trim();
      if (!value) {
        return;
      }

      task.subtasks.push({ id: createId(), text: value, completed: false });
      task.completed = false;
      render();
    });

    taskItem.appendChild(subtaskForm);
    taskList.appendChild(taskItem);
  });

  updateProgress();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) {
    return;
  }

  tasks.push({ id: createId(), text: value, completed: false, subtasks: [] });
  taskInput.value = "";
  render();
});

render();
