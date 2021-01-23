yum.define([
    
], function(){
    
    class Automato extends Pi.Class {
        instances() {
            this.nodes = [];
            this.done = -1;

            this.reset();
        }

        add(from, to, events) {
            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                this.nodes[`${from}:${event}`] = to;
            }

            return this;
        }

        doneOn(done) {
            this.done = done;

            return this;
        }

        onStart(cb) {
            this._cbStart = cb;
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
            if (!this.exist(this.current, event)) {
                this.current = -1;
                if (this._cbInvalid) this._cbInvalid();
                return;
            }

            const from = this.current;
            const to = this.get(from, event);

            if (from == 0 && to > 0) {
                this.reset();
                if (this._cbStart) this._cbStart(event);
            } else if (from > 0 && to > 0) {
                if(this._cbStep) this._cbStep(event);
            }

            this.events.push(event);
            this.current = to;

            if (this.isDone()) {
                if (this._cbDone) this._cbDone();
                this.reset();
            }
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
            return this.current == this.done;
        }
    }

    Pi.Export('Lexicon.Automate', Automato);
});