const buttons = document.getElementsByTagName('button');
Array.from(buttons).forEach(item => {
    item.addEventListener('click', event => {
        const activeDot = document.querySelector('.active-dot');
        activeDot.classList.toggle('active-dot');

        if (event.target.classList.contains('prev')) {
            activeDot.previousElementSibling.classList.toggle('active-dot');
        } else {
            activeDot.nextElementSibling.classList.toggle('active-dot');
        }

        changeSlideByDotPosition();
    });
});

const dots = document.getElementsByClassName('dot');
Array.from(dots).forEach(item => {
    item.addEventListener('click', event => {
        if (item.classList.contains('active-dot')) {
            return;
        }

        const activeDot = document.querySelector('.active-dot');
        activeDot.classList.toggle('active-dot');
        item.classList.toggle('active-dot');
        changeSlideByDotPosition();
    });
});

function changeSlideByDotPosition() {
    const activeSlide = document.querySelector('.active-slide');
    activeSlide.classList.toggle('active-slide');
    const slidePosition = Array.from(dots).findIndex(dot => dot.classList.contains('active-dot'));
    document.getElementsByClassName('slide')[slidePosition].classList.toggle('active-slide');
    adjustButtons();
}

function adjustButtons() {
    const activeSlide = document.querySelector('.active-slide');
    const isThereNextSlide = !!activeSlide.nextElementSibling;
    const isTherePrevSlide = !!activeSlide.previousElementSibling;
    Array.from(buttons).forEach(btn => {
        setVisibility(btn, btn.classList.contains('prev') ? isTherePrevSlide : isThereNextSlide);
    });
}

function setVisibility(btn, isThereAnElement) {
    if (isThereAnElement && btn.classList.contains('inactive-btn')) {
        btn.classList.remove('inactive-btn');
    } else if (!isThereAnElement && !btn.classList.contains('inactive-btn')) {
        btn.classList.add('inactive-btn');
    }
}