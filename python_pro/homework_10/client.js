const requestData = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const endpoints = [1, 2, 3, 4].map(item => {
    return (function () {
        return fetch(`http://localhost:${8000 + item}`, requestData)
            .then(response => {
                return response.json();
            });
    })();
});

Promise.all(endpoints)
    .then(response => {
        console.log('All responses:', response);
    })
