const spinner = document.querySelector('#spinnerOverlay');
const API_KEY = '9ec93cc3650b271b7d1bec0a7249087d';
const paramsToCheck = {
    feels_like: 'Feels like: {}\u00B0C',
    humidity: 'Humidity: {}%',
    pressure: 'Pressure: {}hPa',
    rain: 'Rain: {}mm/h',
    snow: 'Snow: {}mm/h',
};

document.querySelector('button').addEventListener('click', event => getWeather());

function showSpinner() {
    if (!spinner.classList.contains('spinner-display')) {
        spinner.classList.add('spinner-display');
    }
}

function hideSpinner() {
    if (spinner.classList.contains('spinner-display')) {
        spinner.classList.remove('spinner-display');
    }
}

function createDetailElem(template, value) {
    const text = template.replace('{}', value);
    const p = document.createElement('p');
    p.textContent = text;

    return p;
}

function setDetails(parentElem, data) {
    const p = document.createElement('p');
    p.textContent = `Wind: ${data.wind.speed}m/s`;
    parentElem.append(p);

    for (let currentParam in paramsToCheck) {
        if (data.hasOwnProperty(currentParam)) {
            parentElem.append(createDetailElem(paramsToCheck[currentParam], data[currentParam]));
        } else if (data.main.hasOwnProperty(currentParam)) {
            parentElem.append(createDetailElem(paramsToCheck[currentParam], data.main[currentParam]));
        }
    }
}

function removeDetails(parentElem) {
    while (parentElem.hasChildNodes()) {
        parentElem.removeChild(parentElem.firstChild);
    }
}

function saveEndpointData(coords) {
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}` +
                            `&appid=${API_KEY}&units=metric`;
    sessionStorage.setItem('w_endp', endpoint);
}

function getEndpointData() {
    const endpoint = sessionStorage.getItem('w_endp')
    if (endpoint) {
        return endpoint;
    }

    throw new Error('Endpoint has not been found');
}

function getWeather() {
    const endpoint = getEndpointData();
    showSpinner();
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const imgElem = document.querySelector('img');
            imgElem.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            const temperatureElem = document.querySelector('.temperature');
            temperatureElem.textContent = `${data.main.temp}\u00B0C`;

            const descriptionElem = document.querySelector('.description');
            descriptionElem.textContent = data.weather[0].description;

            const placeElem = document.querySelector('h2');
            placeElem.textContent = `${data.name}, ${data.sys.country}`;

            const detailsElem = document.querySelector('.details');
            removeDetails(detailsElem);
            setDetails(detailsElem, data);
        })
        .catch(error => console.error('Error: ', error))
        .finally(() => hideSpinner());
}

window.onload = function () {
    showSpinner();
    navigator.geolocation.getCurrentPosition(
        position => {
            saveEndpointData(position.coords)
            getWeather();
        },
        error => console.error('Error: ', error)
    );
}
