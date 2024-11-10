const buttons = document.getElementsByTagName('button');
Array.from(buttons).forEach(item => {
    item.addEventListener('click', event => {
        const activeDots = document.getElementsByClassName('active-dot');
        const firstActiveDot = activeDots[0];
        firstActiveDot.classList.toggle('active-dot');

        if (event.target.classList.contains('prev')) {
            firstActiveDot.previousElementSibling.classList.toggle('active-dot');
        } else {
            firstActiveDot.nextElementSibling.classList.toggle('active-dot');
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

        const activeDots = document.getElementsByClassName('active-dot');
        Array.from(activeDots).forEach(dot => dot.classList.toggle('active-dot'));
        item.classList.toggle('active-dot');
        changeSlideByDotPosition();
    });
});

function changeSlideByDotPosition() {
    const activeSlides = document.getElementsByClassName('active-slide');
    Array.from(activeSlides).forEach(slide => slide.classList.toggle('active-slide'));
    const slidePosition = Array.from(dots).findIndex(dot => dot.classList.contains('active-dot'));
    document.getElementsByClassName('slide')[slidePosition].classList.toggle('active-slide');
    adjustButtons();
}

function adjustButtons() {
    const activeSlide = document.getElementsByClassName('active-slide')[0];
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