const parentContainer = document.getElementById('parentContainer');

parentContainer.addEventListener('click', evt => {
    if (evt.target.tagName !== 'BUTTON') {
        return;
    }

    alert(`You clicked on button: ${evt.target.id.replace('button', '')}`);
});