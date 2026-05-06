const INTERVAL = 2000;
const SWIPE_THRESHOLD = 50;

const root = document.getElementById('slider');
const track = document.getElementById('sliderTrack');
const slides = Array.from(track.children);
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const toggleBtn = document.getElementById('toggleBtn');
const toggleLabel = document.getElementById('toggleLabel');
const dotsContainer = document.getElementById('sliderDots');

let currentIndex = 0;
let timerId = null;
let isPlaying = true;
let dots = [];

let dragStartX = 0;
let dragDeltaX = 0;
let isDragging = false;
let pointerId = null;

function clearTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function play() {
    clearTimer();
    timerId = setInterval(next, INTERVAL);
}

function pause(soft = false) {
    clearTimer();
    if (!soft) {
        isPlaying = false;
        toggleLabel.textContent = 'Play';
        toggleBtn.setAttribute('aria-label', 'Resume autoplay');
    }
}

function toggle() {
    if (isPlaying) {
        pause();
    } else {
        isPlaying = true;
        toggleLabel.textContent = 'Pause';
        toggleBtn.setAttribute('aria-label', 'Pause autoplay');
        play();
    }
}

function restartIfPlaying() {
    if (isPlaying) play();
}

function goTo(index) {
    const total = slides.length;
    currentIndex = ((index % total) + total) % total;
    track.style.transform = `translateX(${-currentIndex * 100}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
        dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });
}

function next() {
    goTo(currentIndex + 1);
}

function prev() {
    goTo(currentIndex - 1);
}

function buildDots() {
    dotsContainer.innerHTML = '';
    dots = slides.map((_, index) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slider__dot';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `Go to slide ${index + 1}`);
        btn.addEventListener('click', () => {
            goTo(index);
            restartIfPlaying();
        });
        li.appendChild(btn);
        dotsContainer.appendChild(li);
        return btn;
    });
}

function onPointerDown(event) {
    isDragging = true;
    pointerId = event.pointerId;
    dragStartX = event.clientX;
    dragDeltaX = 0;
    track.classList.add('is-dragging');
    track.setPointerCapture(event.pointerId);
    pause(true);
}

function onPointerMove(event) {
    if (!isDragging || event.pointerId !== pointerId) return;
    dragDeltaX = event.clientX - dragStartX;
    const width = root.clientWidth;
    const offset = -currentIndex * 100 + (dragDeltaX / width) * 100;
    track.style.transform = `translateX(${offset}%)`;
}

function onPointerUp(event) {
    if (!isDragging || event.pointerId !== pointerId) return;
    isDragging = false;
    track.classList.remove('is-dragging');
    try {
        track.releasePointerCapture(pointerId);
    } catch (_) {}
    pointerId = null;

    if (dragDeltaX <= -SWIPE_THRESHOLD) {
        next();
    } else if (dragDeltaX >= SWIPE_THRESHOLD) {
        prev();
    } else {
        goTo(currentIndex);
    }

    dragDeltaX = 0;
    restartIfPlaying();
}

function onKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
        restartIfPlaying();
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
        restartIfPlaying();
    } else if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        toggle();
    }
}

function initSlider() {
    buildDots();

    prevBtn.addEventListener('click', () => {
        prev();
        restartIfPlaying();
    });
    nextBtn.addEventListener('click', () => {
        next();
        restartIfPlaying();
    });
    toggleBtn.addEventListener('click', toggle);

    root.addEventListener('keydown', onKeyDown);

    root.addEventListener('mouseenter', () => pause(true));
    root.addEventListener('mouseleave', () => {
        if (isPlaying) play();
    });

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);
    track.addEventListener('dragstart', (event) => event.preventDefault());

    goTo(0);
    play();
}

initSlider();
