const placeHolder = document.getElementById('placeHolder');
const tableTag = document.createElement('table');

for (let i = 0; i <= 10; i++) {
    const trTag = document.createElement('tr');

    for (let j = 0; j <= 10; j++) {
        const tdTag = document.createElement('td');
        tdTag.textContent = i === 0 && j === 0 ? '' : j === 0 ? i : j * Math.max(1, i);
        trTag.appendChild(tdTag);
    }

    tableTag.appendChild(trTag);
}

placeHolder.appendChild(tableTag);
