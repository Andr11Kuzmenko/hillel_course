function setValidity(elem, msg = '') {
    elem.setCustomValidity(msg);
    elem.reportValidity();
}

const dialog = document.getElementById('modal');
dialog.showModal();
dialog.addEventListener('focusout', evt => {
    if (!['input', 'textarea'].includes(evt.target.tagName.toLowerCase())) {
        return;
    }

    let isValid = false;
    let errorMsg = '';
    const targetVal = evt.target.value;
    switch (evt.target.id) {
        case 'name':
            isValid = /^[a-zA-Z]+$/.test(targetVal);
            errorMsg = 'Invalid name';
            break;
        case 'msg':
            isValid = /.{5,}/.test(targetVal);
            errorMsg = 'Should be at least 5 symbols';
            break;
        case 'tel':
            isValid = /^[+]380[0-9]{9}$/.test(targetVal);
            errorMsg = 'Should start with \'+380\' and have 9 more digits';
            break;
        case 'email':
            isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(targetVal);
            errorMsg = 'Invalid email';
            break;
    }

    if (!isValid) {
        setValidity(evt.target, errorMsg);
    }
});
dialog.addEventListener('input', evt => {
    if (!['input', 'textarea'].includes(evt.target.tagName.toLowerCase())) {
        return;
    }

    setValidity(evt.target);
});

const btn = document.getElementById('sendBtn');
btn.addEventListener('click', evt => {
    const elems = document.getElementsByClassName('screen-elem');
    const elementsArray = Array.from(elems);
    const allValid = !!elementsArray.filter(item => !!item.value).length;

    if (allValid) {
        const body = {};
        elementsArray.forEach(item => body[item.id] = item.value);
        console.log('Body', body)
    }
});