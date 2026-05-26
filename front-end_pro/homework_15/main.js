const ul = document.querySelector('ul');
ul.addEventListener('click', event => {
    if (event.target.tagName !== 'BUTTON') {
        return;
    }

    const recordId = event.target.parentNode.getAttribute('data-recordid');
    removeElementFromStorage(recordId);
    event.target.parentNode.remove();
});
ul.addEventListener('change', event => {
    const recordId = event.target.parentNode.getAttribute('data-recordid');
    const todos = JSON.parse(localStorage.getItem('todos'));
    todos.find(item => item.recordId == recordId).isCompleted = event.target.checked;
    localStorage.setItem('todos', JSON.stringify(todos));
    const btn = event.target.parentNode.querySelector('button');
    btn.disabled = event.target.checked;
});

(function() {
    const todos = localStorage.getItem('todos');

    if (todos) {
        const parsedTodos = JSON.parse(todos);
        for (let todo of parsedTodos) {
            showTodoItem(todo);
        }
    }
})();

function showTodoItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.setAttribute('data-recordid', todo.recordId);

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = todo.isCompleted;
    li.append(checkbox);

    const span = document.createElement('span');
    span.classList.add('todo-item__description');
    span.innerText = todo.description;
    li.append(span);

    const button = document.createElement('button');
    button.classList.add('todo-item__delete');
    button.disabled = todo.isCompleted;
    button.innerText = 'Remove';
    li.append(button);

    ul.append(li);
}

function removeElementFromStorage(recordId) {
    const todos = JSON.parse(localStorage.getItem('todos'));
    const filteredTodos = todos.filter(item => item.recordId != recordId);
    localStorage.setItem('todos', JSON.stringify(filteredTodos));
}

const userInput = document.querySelector('.js--form__input');
const form = document.querySelector('form');
form.addEventListener('submit', event => {
    event.preventDefault();

    const newRecord = {
        description: userInput.value,
        isCompleted: false,
        recordId: new Date().getTime()
    };
    showTodoItem(newRecord);

    const todos = localStorage.getItem('todos');
    let totoItems;

    if (todos) {
        totoItems = JSON.parse(todos);
        totoItems.push(newRecord);
    } else {
        totoItems = [newRecord];
    }

    localStorage.setItem('todos', JSON.stringify(totoItems));
});

