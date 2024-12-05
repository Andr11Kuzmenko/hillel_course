const $ul = $('ul');

$ul.on('click', 'button', function() {
    const $parent = $(this).parent();
    const recordId = $parent.data('recordid');
    removeElementFromStorage(recordId);
    $parent.remove();
});

$ul.on('change', 'input[type="checkbox"]', function() {
    const $parent = $(this).parent();
    const recordId = $parent.data('recordid');
    const todos = JSON.parse(localStorage.getItem('todos'));
    const todo = todos.find(item => item.recordId == recordId);
    if (todo) {
        todo.isCompleted = this.checked;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
    const $btn = $parent.find('button');
    $btn.prop('disabled', this.checked);
});

$ul.on('click', 'span.todo-item__description', function() {
    const $span = $(this);
    const $modal = $('#modal');
    $modal.find('.modal-body').text($span.text());
    $modal.modal('show');
});

(function() {
    const todos = localStorage.getItem('todos');
    if (todos) {
        const parsedTodos = JSON.parse(todos);
        parsedTodos.forEach(todo => showTodoItem(todo));
    }
})();

function showTodoItem(todo) {
    const $li = $('<li>')
        .addClass('todo-item')
        .attr('data-recordid', todo.recordId);

    $('<input>')
        .attr('type', 'checkbox')
        .prop('checked', todo.isCompleted)
        .appendTo($li);

    $('<span>')
        .addClass('todo-item__description')
        .text(todo.description)
        .attr('data-bs-toggle', 'modal')
        .attr('data-bs-target', '#modal')
        .appendTo($li);

    $('<button>')
        .addClass('todo-item__delete')
        .prop('disabled', todo.isCompleted)
        .text('Remove')
        .appendTo($li);

    $ul.append($li);
}

function removeElementFromStorage(recordId) {
    const todos = JSON.parse(localStorage.getItem('todos'));
    const filteredTodos = todos.filter(item => item.recordId != recordId);
    localStorage.setItem('todos', JSON.stringify(filteredTodos));
}

const $form = $('form');
const $userInput = $('.js--form__input');
$form.on('submit', function(event) {
    event.preventDefault();
    const newRecord = {
        description: $userInput.val(),
        isCompleted: false,
        recordId: new Date().getTime()
    };
    showTodoItem(newRecord);
    const todos = localStorage.getItem('todos');
    let todoItems;
    if (todos) {
        todoItems = JSON.parse(todos);
        todoItems.push(newRecord);
    } else {
        todoItems = [newRecord];
    }
    localStorage.setItem('todos', JSON.stringify(todoItems));
    $userInput.val('');
});
