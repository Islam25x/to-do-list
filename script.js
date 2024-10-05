// Selectors
const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');
const addTaskButton = document.getElementById('add-task');
const notification = document.getElementById('notification');
let arrayOfTasks = [];

// Load tasks from localStorage on page load
loadTasksFromLocalStorage();

// Event Listeners

// Add task button event
addTaskButton.addEventListener('click', () => {
    if (taskInput.value === '') {
        notification.style.color = 'red';
        notification.innerHTML = 'Please write a task';
    } else {
        addTask(taskInput.value);
        taskInput.value = ''; 
        notification.style.color = 'green';
        notification.innerHTML = 'Task added successfully!';
    }
});

// Functions

// Add task function
function addTask(taskValue) {
    const taskObj = { value: taskValue, completed: false }; // Store task and its completion state
    const listItem = createTaskElement(taskObj);
    taskList.appendChild(listItem);
    storeTaskInLocalStorage(taskObj);
}

// Create a task item and add event listeners for edit/delete/complete
function createTaskElement(taskObj) {
    const listItem = document.createElement('li');
    listItem.classList.toggle('completed', taskObj.completed); // Apply "completed" class if task is done

    listItem.innerHTML = `
        <span>${taskObj.value}</span>
        <div>
            <button class="complete-btn">${taskObj.completed ? 'Undo' : 'Complete'}</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Remove task functionality
    const removeTaskButton = listItem.querySelector('.delete-btn');
    removeTaskButton.addEventListener('click', () => {
        removeTaskFromLocalStorage(taskObj.value);
        listItem.remove();
        notification.style.color = 'green';
        notification.innerHTML = 'Task deleted successfully!';
    });

    // Edit task functionality
    const editTaskButton = listItem.querySelector('.edit-btn');
    editTaskButton.addEventListener('click', () => {
        removeTaskFromLocalStorage(taskObj.value);
        listItem.remove();
        taskInput.value = taskObj.value;
    });

    // Complete/Undo task functionality
    const completeTaskButton = listItem.querySelector('.complete-btn');
    completeTaskButton.addEventListener('click', () => {
        taskObj.completed = !taskObj.completed;
        updateTaskInLocalStorage(taskObj);
        listItem.classList.toggle('completed', taskObj.completed);
        completeTaskButton.textContent = taskObj.completed ? 'Undo' : 'Complete';
    });

    return listItem;
}

// Local Storage Functions

// Store task in localStorage
function storeTaskInLocalStorage(taskObj) {
    let arrayOfTasks = getTasksFromLocalStorage();
    arrayOfTasks.push(taskObj);
    localStorage.setItem('tasks', JSON.stringify(arrayOfTasks));
}

// Get tasks from localStorage
function getTasksFromLocalStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const arrayOfTasks = getTasksFromLocalStorage();
    arrayOfTasks.forEach(task => {
        const listItem = createTaskElement(task); // Use the createTaskElement function to recreate the task
        taskList.appendChild(listItem);
    });
}

// Update task in localStorage after editing/completing
function updateTaskInLocalStorage(updatedTask) {
    let arrayOfTasks = getTasksFromLocalStorage();
    arrayOfTasks = arrayOfTasks.map(task => task.value === updatedTask.value ? updatedTask : task);
    localStorage.setItem('tasks', JSON.stringify(arrayOfTasks));
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskValue) {
    let arrayOfTasks = getTasksFromLocalStorage();
    arrayOfTasks = arrayOfTasks.filter(t => t.value !== taskValue);
    localStorage.setItem('tasks', JSON.stringify(arrayOfTasks));
}
