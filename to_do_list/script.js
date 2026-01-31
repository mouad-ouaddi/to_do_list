// Select elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const pendingCount = document.getElementById('pending-count');
const clearBtn = document.getElementById('clear-btn');
const dateElement = document.getElementById('date');

// Display current date
const options = { weekday: 'long', month: 'short', day: 'numeric' };
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString('en-US', options);

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize
function init() {
    renderTasks();
}

init();

// Add task
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = todoInput.value.trim();
    
    if (taskText === '') {
        // Shake animation for empty input
        todoInput.parentElement.classList.add('shake');
        setTimeout(() => {
            todoInput.parentElement.classList.remove('shake');
        }, 500);
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    todoInput.value = '';
}

// Delete or Toggle task
todoList.addEventListener('click', (e) => {
    const target = e.target;
    const li = target.closest('li');
    
    if (!li) return;

    const id = parseInt(li.getAttribute('data-id'));

    // If delete button clicked
    if (target.closest('.delete-btn')) {
        deleteTask(id);
    } 
    // If task content clicked (toggle completion)
    else {
        toggleTask(id);
    }
});

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Clear all tasks
clearBtn.addEventListener('click', () => {
    tasks = [];
    saveTasks();
    renderTasks();
});

// Save to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    todoList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <span class="task-content">${escapeHtml(task.text)}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        
        todoList.appendChild(li);
    });

    updatePendingCount();
}

function updatePendingCount() {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    pendingCount.textContent = pendingTasks;
}

// Prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
