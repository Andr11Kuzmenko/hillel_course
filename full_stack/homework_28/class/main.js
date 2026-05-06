class Slider {
    static defaults = {
        interval: 3000,
        autoplay: true,
        showArrows: true,
        showDots: true,
        showToggle: true,
        pauseOnHover: true,   
        loop: true,           
    };

    constructor(root, config = {}) {
        if (!root) throw new Error('Slider: root element is required');
        this.root = root;
        this.config = { ...this.constructor.defaults, ...config };
        this.currentIndex = 0;
        this.timerId = null;
        this.isPlaying = this.config.autoplay;
        this.dots = [];
        this.init();
    }

    init() {
        this.track = this.root.querySelector('.slider__track');
        this.slides = Array.from(this.track.children);
        this.buildControls();
        this.bindEvents();
        this.goTo(0);
        if (this.isPlaying) this.play();
    }

    buildControls() {
        if (this.config.showArrows) this.buildArrows();
        if (this.config.showToggle || this.config.showDots) this.buildBottomBar();
    }

    buildArrows() {
        this.prevBtn = this.createBtn('slider__btn slider__btn--prev', '❮', 'Previous slide');
        this.nextBtn = this.createBtn('slider__btn slider__btn--next', '❯', 'Next slide');
        this.root.append(this.prevBtn, this.nextBtn);
    }

    buildBottomBar() {
        this.controls = document.createElement('div');
        this.controls.className = 'slider__controls';

        if (this.config.showToggle) {
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.type = 'button';
            this.toggleBtn.className = 'slider__toggle';
            this.toggleBtn.setAttribute('aria-label', 'Pause autoplay');
            this.toggleBtn.innerHTML = '<span class="slider__toggle-label">Pause</span>';
            this.toggleLabel = this.toggleBtn.querySelector('.slider__toggle-label');
            this.controls.appendChild(this.toggleBtn);
        }

        if (this.config.showDots) {
            this.dotsContainer = document.createElement('ul');
            this.dotsContainer.className = 'slider__dots';
            this.dotsContainer.setAttribute('role', 'tablist');
            this.dotsContainer.setAttribute('aria-label', 'Go to slide');
            this.buildDots();
            this.controls.appendChild(this.dotsContainer);
        }

        this.root.appendChild(this.controls);
    }

    createBtn(className, glyph, label) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = className;
        btn.setAttribute('aria-label', label);
        btn.innerHTML = `<span aria-hidden="true">${glyph}</span>`;
        return btn;
    }

    buildDots() {
        this.dots = this.slides.map((_, index) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'slider__dot';
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-label', `Go to slide ${index + 1}`);
            li.appendChild(btn);
            this.dotsContainer.appendChild(li);
            return btn;
        });
    }

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => { this.prev(); this.restart(); });
        this.nextBtn?.addEventListener('click', () => { this.next(); this.restart(); });
        this.toggleBtn?.addEventListener('click', () => this.toggle());
        this.dots.forEach((dot, i) =>
            dot.addEventListener('click', () => { this.goTo(i); this.restart(); })
        );
        this.root.addEventListener('keydown', (e) => this.onKey(e));

        if (this.config.pauseOnHover) {
            this.root.addEventListener('mouseenter', () => this.pause(true));
            this.root.addEventListener('mouseleave', () => { if (this.isPlaying) this.play(); });
        }
    }

    onKey(event) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.prev();
            this.restart();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.next();
            this.restart();
        } else if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault();
            this.toggle();
        }
    }

    goTo(index) {
        const total = this.slides.length;
        this.currentIndex = ((index % total) + total) % total;
        this.track.style.transform = `translateX(${-this.currentIndex * 100}%)`;
        this.dots.forEach((dot, i) => {
            const active = i === this.currentIndex;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    next() { this.goTo(this.currentIndex + 1); }
    prev() { this.goTo(this.currentIndex - 1); }

    play() {
        this.stopTimer();
        this.timerId = setInterval(() => this.next(), this.config.interval);
    }

    pause(soft = false) {
        this.stopTimer();
        if (!soft) {
            this.isPlaying = false;
            if (this.toggleLabel) this.toggleLabel.textContent = 'Play';
            this.toggleBtn?.setAttribute('aria-label', 'Resume autoplay');
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.isPlaying = true;
            if (this.toggleLabel) this.toggleLabel.textContent = 'Pause';
            this.toggleBtn?.setAttribute('aria-label', 'Pause autoplay');
            this.play();
        }
    }

    restart() {
        if (this.isPlaying) this.play();
    }

    stopTimer() {
        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
}

class DraggableSlider extends Slider {
    static defaults = {
        ...Slider.defaults,
        swipeThreshold: 50,
    };

    init() {
        super.init();
        this.drag = { startX: 0, deltaX: 0, dragging: false, pointerId: null };
        this.bindDrag();
    }

    bindDrag() {
        this.track.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.track.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.track.addEventListener('pointerup', (e) => this.onPointerUp(e));
        this.track.addEventListener('pointercancel', (e) => this.onPointerUp(e));
        this.track.addEventListener('dragstart', (e) => e.preventDefault());
    }

    onPointerDown(e) {
        const s = this.drag;
        s.dragging = true;
        s.pointerId = e.pointerId;
        s.startX = e.clientX;
        s.deltaX = 0;
        this.track.classList.add('is-dragging');
        try { this.track.setPointerCapture(e.pointerId); } catch (_) {}
        this.pause(true);
    }

    onPointerMove(e) {
        const s = this.drag;
        if (!s.dragging || e.pointerId !== s.pointerId) return;
        s.deltaX = e.clientX - s.startX;
        const w = this.root.clientWidth;
        const offset = -this.currentIndex * 100 + (s.deltaX / w) * 100;
        this.track.style.transform = `translateX(${offset}%)`;
    }

    onPointerUp(e) {
        const s = this.drag;
        if (!s.dragging || e.pointerId !== s.pointerId) return;
        s.dragging = false;
        this.track.classList.remove('is-dragging');
        try { this.track.releasePointerCapture(s.pointerId); } catch (_) {}
        s.pointerId = null;

        const t = this.config.swipeThreshold;
        if (s.deltaX <= -t) this.next();
        else if (s.deltaX >= t) this.prev();
        else this.goTo(this.currentIndex);

        s.deltaX = 0;
        this.restart();
    }
}

new DraggableSlider(document.getElementById('slider'), {
    interval: 3000,
    autoplay: true,
    showArrows: true,
    showDots: true,
    showToggle: true,
    pauseOnHover: true,
    swipeThreshold: 50,
});
