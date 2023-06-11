// URL API
const URL = 'http://localhost:3000/tasks';

// Elementos HTML
const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form');
let inputTask = document.querySelector('.input-task');

// GET
const fetchTasks = async () => {

    const response = await fetch(URL);
    const data = await response.json();

    return data;
};

// POST
const addTask = async (event) => {

    event.preventDefault();

    const task = { title: inputTask.value };

    await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    });

    loadTasks();
    inputTask = '';
};

// DELETE
const deleteTask = async (id) => {

    await fetch(`${URL}/${id}`, {
        method: 'DELETE'
    });

    loadTasks();
};

// PUT
const updateTask = async (task) => {

    const { id, title, status } = task;

    await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        // Quando a chave e o valor são iguais não precisa passar chave e valor separadamente
        // EX: body: { title: title, status: status }
        body: JSON.stringify({ title, status })
    });

    loadTasks();
};

const formatDate = (dateUTC) => {

    const options = { dateStyle: 'long', timeStyle: 'short' };

    const date = new Date(dateUTC).toLocaleString('pt-BR', options);

    return date;
};

const createElement = (tag, innerText = '', innerHTML = '') => {

    const element = document.createElement(tag);

    if (innerText) {
        element.innerText = innerText;
    }

    if (innerHTML) {
        element.innerHTML = innerHTML;
    }

    return element;
};

const createSelect = (value) => {

    const options = `
        <option value="Pendente">Pendente</option>
        <option value="Em Andamento">Em Andamento</option>
        <option value="Concluída">Concluída</option>
    `;

    const select = createElement('select', '', options);

    select.value = value;

    return select;
};

const createRow = (task) => {

    const { id, title, created_at, status } = task;

    const tr = createElement('tr');
    const tdTitle = createElement('td', title);
    const tdCreateAt = createElement('td', formatDate(created_at));
    const tdStatus = createElement('td');
    const tdActions = createElement('td');

    const select = createSelect(status);

    select.addEventListener('change', ({ target }) => {
        updateTask({ ...task, status: target.value });
    });

    const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>');
    const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>');

    editButton.classList.add('btn-action');
    deleteButton.classList.add('btn-action');

    deleteButton.addEventListener('click', () => {
        deleteTask(id);
    });

    const editForm = createElement('form');
    const editInput = createElement('input');

    editInput.value = title;
    editForm.appendChild(editInput);

    editForm.addEventListener('submit', (event) => {

        event.preventDefault();

        updateTask({ id, title: editInput.value, status });
    });

    editButton.addEventListener('click', () => {
        tdTitle.innerText = '';
        tdTitle.appendChild(editForm);
    });

    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);

    tdStatus.appendChild(select);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCreateAt);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    return tr;
};

const loadTasks = async () => {

    const tasks = await fetchTasks();

    tbody.innerHTML = '';

    tasks.forEach((task) => {

        const tr = createRow(task);

        tbody.appendChild(tr);
    });
};

addForm.addEventListener('submit', addTask);

loadTasks();
