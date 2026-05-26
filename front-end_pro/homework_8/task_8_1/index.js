let ladder = {
        _current: 0,
        up: function () {
            this._current++;
            return this;
        },
        down: function () {
            this._current = Math.max(0, this._current - 1);
            return this;
        },
        showStep: function () {
            console.log(`Current: ${this._current}`)
            return this;
        }
};

ladder.up().up().up().showStep().down().down().down().down().showStep();