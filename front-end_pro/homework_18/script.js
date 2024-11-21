class Timer {
    #time;
    #intervalId;
    #elem;

    constructor(initValue) {
        this.#time = initValue;
        this.#elem = document.querySelector('#timer');
    }

    #count = () => {
        const sec = this.#time % 60;
        const min = Math.floor(this.#time / 60);
        this.#elem.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        if (!this.#time) {
            clearInterval(this.#intervalId);
        }

        this.#time -= 1;
    }

    start = () =>  {
        if (this.#intervalId) {
            return;
        }

        this.#intervalId = setInterval(this.#count, 1000);
    }
}

timer = new Timer(100);
timer.start();