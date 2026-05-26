const ulTag = document.getElementById('parentContainer');
ulTag.addEventListener('click', evt => {
    if (evt.target.tagName !== 'BUTTON') {
        return;
    }

    evt.target.parentNode.remove();
});

function handleCreateTask() {
    const liTag = document.createElement('li');

    const spanTag  = document.createElement('span');
    spanTag.textContent = document.getElementById('taskDescription').value;
    liTag.appendChild(spanTag);

    const buttonTag = document.createElement('button');
    buttonTag.textContent = 'Remove';
    liTag.appendChild(buttonTag);

    ulTag.appendChild(liTag);
}