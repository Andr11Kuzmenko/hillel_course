function setValidity(elem, msg = '') {
    elem.setCustomValidity(msg);
    elem.reportValidity();
}

const form = document.querySelector('form');
form.addEventListener('input', evt => {
    if (!['input', 'textarea'].includes(evt.target.tagName.toLowerCase())) {
        return;
    }

    let isValid = false;
    let errorMsg = '';
    const targetVal = evt.target.value;
    switch (evt.target.name) {
        case 'name':
            isValid = /^[a-zA-Z]+$/.test(targetVal);
            errorMsg = 'Invalid name';
            break;
        case 'message':
            isValid = /.{5,}/.test(targetVal);
            errorMsg = 'Should be at least 5 symbols';
            break;
        case 'tel':
            isValid = /^[+]380[0-9]{9}$/.test(targetVal);
            errorMsg = 'Should start with \'+380\' and have 9 more digits';
            break;
        case 'e-mail':
            isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(targetVal);
            errorMsg = 'Invalid email';
            break;
    }

    setValidity(evt.target, !isValid ? errorMsg : '');
});

form.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObj = {};

    formData.forEach((value, key) => formObj[key] = value)

    console.log(formObj);
})