function Slider(root, config) {
    if (!root) throw new Error('Slider: root element is required');
    this.root = root;
    this.config = Object.assign({}, Slider.defaults, config || {});
    this.currentIndex = 0;
    this.timerId = null;
    this.isPlaying = this.config.autoplay;
    this.dots = [];
    this._init();
}

Slider.defaults = {
    interval: 3000,
    autoplay: true,
    showArrows: true,
    showDots: true,
    showToggle: true,
    loop: true, 
};

Slider.prototype._init = function () {
    this.track = this.root.querySelector('.slider__track');
    this.slides = Array.from(this.track.children);
    this._buildControls();
    this._bindEvents();
    this.goTo(0);
    if (this.isPlaying) this.play();
};

Slider.prototype._buildControls = function () {
    if (this.config.showArrows) this._buildArrows();
    if (this.config.showToggle || this.config.showDots) this._buildBottomBar();
};

Slider.prototype._buildArrows = function () {
    this.prevBtn = this._createBtn('slider__btn slider__btn--prev', '❮', 'Previous slide');
    this.nextBtn = this._createBtn('slider__btn slider__btn--next', '❯', 'Next slide');
    this.root.appendChild(this.prevBtn);
    this.root.appendChild(this.nextBtn);
};

Slider.prototype._buildBottomBar = function () {
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
        this._buildDots();
        this.controls.appendChild(this.dotsContainer);
    }

    this.root.appendChild(this.controls);
};

Slider.prototype._createBtn = function (className, glyph, label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = '<span aria-hidden="true">' + glyph + '</span>';
    return btn;
};

Slider.prototype._buildDots = function () {
    const self = this;
    this.dots = this.slides.map(function (_, index) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slider__dot';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', 'Go to slide ' + (index + 1));
        li.appendChild(btn);
        self.dotsContainer.appendChild(li);
        return btn;
    });
};

Slider.prototype._bindEvents = function () {
    const self = this;
    if (this.prevBtn) this.prevBtn.addEventListener('click', function () { self.prev(); self._restart(); });
    if (this.nextBtn) this.nextBtn.addEventListener('click', function () { self.next(); self._restart(); });
    if (this.toggleBtn) this.toggleBtn.addEventListener('click', function () { self.toggle(); });
    this.dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { self.goTo(i); self._restart(); });
    });
    this.root.addEventListener('keydown', function (e) { self._onKey(e); });
};

Slider.prototype._onKey = function (event) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.prev();
        this._restart();
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.next();
        this._restart();
    } else if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        this.toggle();
    }
};

Slider.prototype.goTo = function (index) {
    const total = this.slides.length;
    this.currentIndex = ((index % total) + total) % total;
    this.track.style.transform = 'translateX(' + (-this.currentIndex * 100) + '%)';
    this.dots.forEach(function (dot, i) {
        const active = i === this.currentIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
    }, this);
};

Slider.prototype.next = function () { this.goTo(this.currentIndex + 1); };
Slider.prototype.prev = function () { this.goTo(this.currentIndex - 1); };

Slider.prototype.play = function () {
    this._stopTimer();
    const self = this;
    this.timerId = setInterval(function () { self.next(); }, this.config.interval);
};

Slider.prototype.pause = function (soft) {
    this._stopTimer();
    if (!soft) {
        this.isPlaying = false;
        if (this.toggleLabel) this.toggleLabel.textContent = 'Play';
        if (this.toggleBtn) this.toggleBtn.setAttribute('aria-label', 'Resume autoplay');
    }
};

Slider.prototype.toggle = function () {
    if (this.isPlaying) {
        this.pause();
    } else {
        this.isPlaying = true;
        if (this.toggleLabel) this.toggleLabel.textContent = 'Pause';
        if (this.toggleBtn) this.toggleBtn.setAttribute('aria-label', 'Pause autoplay');
        this.play();
    }
};

Slider.prototype._restart = function () {
    if (this.isPlaying) this.play();
};

Slider.prototype._stopTimer = function () {
    if (this.timerId !== null) {
        clearInterval(this.timerId);
        this.timerId = null;
    }
};

function DraggableSlider(root, config) {
    Slider.call(this, root, config);
}

DraggableSlider.prototype = Object.create(Slider.prototype);
DraggableSlider.prototype.constructor = DraggableSlider;

DraggableSlider.defaults = Object.assign({}, Slider.defaults, {
    swipeThreshold: 50,
});

DraggableSlider.prototype._init = function () {
    this.config = Object.assign({}, DraggableSlider.defaults, this.config);
    Slider.prototype._init.call(this);
    this._drag = { startX: 0, deltaX: 0, dragging: false, pointerId: null };
    this._bindDrag();
};

DraggableSlider.prototype._bindDrag = function () {
    const self = this;
    this.track.addEventListener('pointerdown', function (e) { self._onPointerDown(e); });
    this.track.addEventListener('pointermove', function (e) { self._onPointerMove(e); });
    this.track.addEventListener('pointerup', function (e) { self._onPointerUp(e); });
    this.track.addEventListener('pointercancel', function (e) { self._onPointerUp(e); });
    this.track.addEventListener('dragstart', function (e) { e.preventDefault(); });
};

DraggableSlider.prototype._onPointerDown = function (e) {
    const s = this._drag;
    s.dragging = true;
    s.pointerId = e.pointerId;
    s.startX = e.clientX;
    s.deltaX = 0;
    this.track.classList.add('is-dragging');
    try { this.track.setPointerCapture(e.pointerId); } catch (_) {}
    this.pause(true);
};

DraggableSlider.prototype._onPointerMove = function (e) {
    const s = this._drag;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    s.deltaX = e.clientX - s.startX;
    const w = this.root.clientWidth;
    const offset = -this.currentIndex * 100 + (s.deltaX / w) * 100;
    this.track.style.transform = 'translateX(' + offset + '%)';
};

DraggableSlider.prototype._onPointerUp = function (e) {
    const s = this._drag;
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
    this._restart();
};

new DraggableSlider(document.getElementById('slider'), {
    interval: 3000,
    autoplay: true,
    showArrows: true,
    showDots: true,
    showToggle: true,
    swipeThreshold: 50,
});
