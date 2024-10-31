let defaultTextColor = true;

function getRandomColor() {
    let res = '#';

    for (let i = 0; i < 6; i++) {
        res = `${res}${Math.floor(Math.random() * 15).toString(16)}`;
    }

    return res;
}

function handleOnClick() {
    const articleTag = document.getElementById('customArticle');
    articleTag.style.color = !defaultTextColor ? '#000000' : getRandomColor();
    defaultTextColor = !defaultTextColor;
}

