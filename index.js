const fs = require("fs");
const path = "./tasks.json";

const loadTasks = () => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([]));
  }
  const dataBuffer = fs.readFileSync(path);
  return JSON.parse(dataBuffer.toString());
};

const saveTasks = (tasks) => {
  fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
};

const addTask = (description) => {
  const tasks = loadTasks();
  const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  const newTask = {
    id,
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`Task added successfully (ID: ${id})`);
};

const updateTask = (id, description) => {
  const tasks = loadTasks();
  const task = tasks.find((task) => task.id === parseInt(id));
  if (!task) {
    console.log("Task not found!");
    return;
  }
  task.description = description;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log("Task updated successfully");
};

const deleteTask = (id) => {
  let tasks = loadTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  if (tasks.length === initialLength) {
    console.log("Task not found!");
    return;
  }
  saveTasks(tasks);
  console.log("Task deleted successfully");
};

const markTask = (id, status) => {
  const tasks = loadTasks();
  const task = tasks.find((task) => task.id === parseInt(id));
  if (!task) {
    console.log("Task not found!");
    return;
  }
  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`Task marked as ${status}`);
};

const listTasks = (status) => {
  const tasks = loadTasks();
  const filteredTasks = status
    ? tasks.filter((task) => task.status === status)
    : tasks;
  console.log(filteredTasks);
};

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case "add":
    addTask(args[0]);
    break;
  case "update":
    updateTask(args[0], args[1]);
    break;
  case "delete":
    deleteTask(args[0]);
    break;
  case "mark-in-progress":
    markTask(args[0], "in-progress");
    break;
  case "mark-done":
    markTask(args[0], "done");
    break;
  case "list":
    listTasks(args[0]);
    break;
  default:
    console.log("Invalid command");
}
