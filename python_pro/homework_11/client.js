const requestData = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

fetch('http://localhost:8080', requestData)
    .then(response => {
        console.log(response);
    });

fetch('http://localhost:8080/slow', requestData)
    .then(response => {
        console.log(response);
    });

fetch('http://localhost:8080', requestData)
    .then(response => {
        console.log(response);
    });
