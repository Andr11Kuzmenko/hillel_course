const buttons = document.getElementsByTagName('button');
Array.from(buttons).forEach(item => {
    item.addEventListener('click', event => {
        console.log('eleve');
    })
});