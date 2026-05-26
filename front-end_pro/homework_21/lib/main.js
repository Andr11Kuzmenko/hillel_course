"use strict";

var $ul = $('ul');
$ul.on('click', 'button', function () {
  var $parent = $(this).parent();
  var recordId = $parent.data('recordid');
  removeElementFromStorage(recordId);
  $parent.remove();
});
$ul.on('change', 'input[type="checkbox"]', function () {
  var $parent = $(this).parent();
  var recordId = $parent.data('recordid');
  var todos = JSON.parse(localStorage.getItem('todos'));
  var todo = todos.find(function (item) {
    return item.recordId == recordId;
  });
  if (todo) {
    todo.isCompleted = this.checked;
  }
  localStorage.setItem('todos', JSON.stringify(todos));
  var $btn = $parent.find('button');
  $btn.prop('disabled', this.checked);
});
$ul.on('click', 'span.todo-item__description', function () {
  var $span = $(this);
  var $modal = $('#modal');
  $modal.find('.modal-body').text($span.text());
  $modal.modal('show');
});
(function () {
  var todos = localStorage.getItem('todos');
  if (todos) {
    var parsedTodos = JSON.parse(todos);
    parsedTodos.forEach(function (todo) {
      return showTodoItem(todo);
    });
  }
})();
function showTodoItem(todo) {
  var $li = $('<li>').addClass('todo-item').attr('data-recordid', todo.recordId);
  $('<input>').attr('type', 'checkbox').prop('checked', todo.isCompleted).appendTo($li);
  $('<span>').addClass('todo-item__description').text(todo.description).attr('data-bs-toggle', 'modal').attr('data-bs-target', '#modal').appendTo($li);
  $('<button>').addClass('todo-item__delete').prop('disabled', todo.isCompleted).text('Remove').appendTo($li);
  $ul.append($li);
}
function removeElementFromStorage(recordId) {
  var todos = JSON.parse(localStorage.getItem('todos'));
  var filteredTodos = todos.filter(function (item) {
    return item.recordId != recordId;
  });
  localStorage.setItem('todos', JSON.stringify(filteredTodos));
}
var $form = $('form');
var $userInput = $('.js--form__input');
$form.on('submit', function (event) {
  event.preventDefault();
  var newRecord = {
    description: $userInput.val(),
    isCompleted: false,
    recordId: new Date().getTime()
  };
  showTodoItem(newRecord);
  var todos = localStorage.getItem('todos');
  var todoItems;
  if (todos) {
    todoItems = JSON.parse(todos);
    todoItems.push(newRecord);
  } else {
    todoItems = [newRecord];
  }
  localStorage.setItem('todos', JSON.stringify(todoItems));
  $userInput.val('');
});