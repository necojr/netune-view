yum.define([

], function () {

    class Lyrics extends Pi.Class {

        instances() {
            this._titulo = '';
            this._versao = '';
            this._youtube = '';
            this._tokens = [];

            this._numCoro = 0;
            this._numEstrofe = 0;
            this._numPonte = 0;
        }

        get text() {
            var text = [];

            text.push(`nome\n${this.titulo}`);
            text.push(`\n\nversao\n${this.versao}`);

            for (let i = 0; i < this._tokens.length; i++) {
                const token = this._tokens[i];
                const key = token.key.replace(/\d+/gi, '');
                const value = token.value;

                if (token.isTitle) {
                    text.push(`\n\n${key}`);

                    if (value.length > 0) {
                        text.push(`\n${value}`);
                    }
                } else {
                    text.push(`\n${key}\n${value}`);
                }
            }

            return text.join('');
        }

        trocarTom(newTom) {
            if (newTom.length == 0) return;
            if (newTom == this._tom) return;

            var escalaMaiorNatural = {
                'A': ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
                'A#': ['A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
                'B': ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
                'C': ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
                'C#': ['C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
                'D': ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
                'D#': ['D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
                'E': ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
                'F': ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
                'F#': ['F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'],
                'G': ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
                'G#': ['G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G']
            };

            var oldNotes = escalaMaiorNatural[this._tom.toUpperCase()];
            if (oldNotes == null) return;
            
            var newNotes = escalaMaiorNatural[newTom.toUpperCase()];
            if (newNotes == null) return;

            for (let i = 0; i < this._tokens.length; i++) {
                const token = this._tokens[i];

                if (token.isTitle) {
                    token.value = token.value.replace(/[A-G]#?b?/g, (note) => {
                        var index = oldNotes.indexOf(note);
                        return newNotes[index];
                    });
                } else {
                    token.key = token.key.replace(/[A-G]#?b?/g, (note) => {
                        var index = oldNotes.indexOf(note);
                        return newNotes[index];
                    });
                }
            }

            this._tom = newTom;
        }

        add(field, value) {
            this[field] = this.clear(value);
        }

        set youtube(value) {
            this._youtube = value[0];
        }

        get tokens() {
            return this._tokens;
        }

        set musica(value) {
            this._titulo = value[0];
        }

        set nome(value) {
            this._titulo = value[0];
        }

        set titulo(value) {
            this._titulo = value[0];
        }

        get titulo() {
            return this._titulo || '';
        }

        get versao() {
            return this._versao || '';
        }

        get tom() {
            return (this._tom || '').toUpperCase();
        }

        set versao(value) {
            this._versao = value[0];
        }

        set intro(value) {
            this._tokens.push({
                key: 'INTRO',
                value: value[0],
                isBreakable: true,
                isTitle: true,
            });
        }

        set tom(value) {
            this._tom = value[0];

            this._tokens.push({
                key: 'TOM',
                value: value[0],
                isBreakable: true,
                isTitle: true
            });
        }

        addEstrofe(nome, arr, tag = '') {
            this._tokens.push({
                key: nome,
                value: '',
                isBreakable: true,
                isTitle: true
            });

            for (let i = 0; i < arr.length; i += 2) {
                this._tokens.push({
                    key: arr[i],
                    value: arr[i + 1],
                    isBreakable: i > 0,
                    isTitle: false,
                    tag: tag
                });
            }
        }

        set estrofe(estrofe) {
            this._numEstrofe++;
            this.addEstrofe(`ESTROFE ${this._numEstrofe}`, this.clear(estrofe), 'ESTROFE');
        }

        set ponte(ponte) {
            this._numPonte++;
            this.addEstrofe(`PONTE ${this._numPonte}`, this.clear(ponte), 'PONTE');
        }

        set coro(coro) {
            this._numCoro++;
            this.addEstrofe(`CORO ${this._numCoro}`, this.clear(coro), 'CORO');
        }

        clear(arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
                if (this.isEmpty(arr[i])) {
                    arr.pop()
                } else {
                    break;
                }
            }

            return arr;
        }

        isEmpty(linha) {
            linha = linha.replace(/\s/gi, '');
            linha = linha.replace(/\t/gi, '');

            return linha.length == 0;
        }
    };

    Pi.Export('Music.Lyrics', Lyrics);
});