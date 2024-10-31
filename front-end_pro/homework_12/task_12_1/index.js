let url = '#';

function handlePromptRequest() {
    url = prompt('Enter valid url');
}

function handleGoTo() {
    window.open(`${url.startsWith('http') ? '' : 'https://'}${url}`)
}