yum.define([

], function () {

    class Automato extends Pi.Class {
        instances() {
            this.nodes = [];
            this.enabled = true;

            this._stepStart = {
                from: 0,
                to: 1
            };

            this._stepRestart = {
                from: -1,
                to: -1
            };

            this._stepFinish = -1;


            this.reset();
        }

        add(from, to, events) {
            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                this.nodes[`${from}:${event}`] = to;
            }

            return this;
        }

        enable(b) {
            this.enabled = b;

            return this;
        }

        stepStart(from, to) {
            this._stepStart = {
                from: from,
                to: to
            };
        }

        stepRestart(from, to) {
            this._stepRestart = {
                from: from,
                to: to
            };
        }

        stepFinish(_stepFinish) {
            this._stepFinish = _stepFinish;

            return this;
        }

        onStart(cb) {
            this._cbStart = cb;
        }

        onRestart(cb){
            this._cbRestart = cb;
        }

        onStep(cb) {
            this._cbStep = cb;
        }

        onDone(cb) {
            this._cbDone = cb;
        }

        onInvalid(cb) {
            this._cbInvalid = cb;
        }

        trigger(event) {
            if (!this.enabled) return this;

            if (!this.exist(this.current, event)) {
                if (this._cbInvalid) this._cbInvalid(this.current);

                this.current = -1;
                return this;
            }

            const from = this.current;
            const to = this.get(from, event);

            if (from == this._stepStart.from && to == this._stepStart.to) {
                this.events = [];
                if (this._cbStart) this._cbStart(event);
            } else if (from == this._stepRestart.from && to == this._stepStart.to) {
                if (this._cbRestart) this._cbRestart(event);
                this.events = [];
            } else if (from > 0 && to > 0) {
                if (this._cbStep) this._cbStep(event);
            }

            this.events.push(event);
            this.current = to;

            if (this.isDone()) {
                if (this._cbDone) this._cbDone();
                this.reset();
            }

            return this;
        }

        reset() {
            this.current = 0;
            this.events = [];

            return this;
        }

        get(from, event) {
            return this.nodes[`${from}:${event}`];
        }

        exist(from, event) {
            return this.get(from, event) !== undefined;
        }

        isValid() {
            return this.current != -1;
        }

        isDone() {
            return this.current == this._stepFinish;
        }
    }

    Pi.Export('Lexicon.Automate', Automato);
});