// Obtener referencias a los elementos del DOM
const taskInput = document.getElementById('task-input'); // Input para ingresar tareas
const addTaskBtn = document.getElementById('add-task-btn'); // Botón para agregar tareas
const taskList = document.querySelector('#task-list'); // Lista donde se mostrarán las tareas

// Función para crear un nuevo elemento de tarea
function createTaskElement(taskText) {

    // Crear un nuevo elemento de lista para la tarea
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item'; // Agregar una clase para estilos    
    taskItem.textContent = taskText; // Establecer el texto de la tarea

    // Agregar un botón de eliminar a cada tarea
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Eliminar'; // Texto del botón de eliminar

    deleteBtn.addEventListener('click', () => {
        taskItem.remove(); // Eliminar la tarea de la lista al hacer clic en el botón
    });

    // Agregar el botón de eliminar al elemento de la tarea
    taskItem.appendChild(deleteBtn);

    // Agregar la tarea a la lista
    taskList.appendChild(taskItem);
}

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim(); // Obtener el texto ingresado en el input

    // Verificar que el texto no esté vacío antes de crear la tarea
    if (taskText !== '') {
        createTaskElement(taskText); // Crear un nuevo elemento de tarea con el texto ingresado
        taskInput.value = ''; // Limpiar el input después de agregar la tarea
    }
});

function saveTasks() {
    const taskItems = document.querySelectorAll('.task-item'); // Obtener todas las tareas
}
