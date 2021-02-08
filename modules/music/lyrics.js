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
            this._numParte = 0;
        }

        get text() {
            var text = [];

            text.push(`MUSICA\n${this.titulo}`);
            text.push(`\n\nVERSAO\n${this.versao}`);
            if (this.youtube.length > 0) {
                text.push(`\n\nYOUTUBE\n${this.youtube}`)
            }

            for (let i = 0; i < this._tokens.length; i++) {
                const token = this._tokens[i];
                const key = token.key.replace(/\s\d+/gi, '');
                const value = token.value;

                if (token.isTitle) {
                    text.push(`\n\n${key.toUpperCase()}`);

                    if (value.length > 0) {
                        text.push(`\n${this.convertNoteToUpper(value)}`);
                    }
                } else {
                    text.push(`\n${this.convertNoteToUpper(key)}\n${value}`);
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

            var escalaMaiorNaturalBemol = {
                'A': ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'],
                'Bb': ['Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A'],
                'B': ['B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb'],
                'C': ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
                'Db': ['Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C'],
                'D': ['D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db'],
                'Eb': ['Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D'],
                'E': ['E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb'],
                'F': ['F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E'],
                'Gb': ['Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F'],
                'G': ['G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb'],
                'Ab': ['Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G']
            };

            var oldNotes = escalaMaiorNatural[this.tom.toUpperCase()];
            if (oldNotes == null) return;


            var newNotes = escalaMaiorNatural[newTom.toUpperCase()];
            if (newNotes == null) return;

            var oldNotesBemol = escalaMaiorNaturalBemol[this.tom.toUpperCase()];
            var newNotesBemol = escalaMaiorNaturalBemol[newTom.toUpperCase()];

            for (let i = 0; i < this._tokens.length; i++) {
                const token = this._tokens[i];

                if (token.isTitle) {
                    token.value = token.value.replace(/([a-g]|[A-G])#?b?/gi, (note) => {
                        note = Pi.String.capital(note);
                        var index = oldNotes.indexOf(note);
                        if (index == -1) {
                            index = oldNotesBemol.indexOf(note);
                            if (index == -1) return note;
                            else return newNotesBemol[index];
                        }
                        return newNotes[index];
                    });
                } else {
                    token.key = token.key.replace(/([a-g]|[A-G])#?b?/gi, (note) => {
                        note = Pi.String.capital(note);
                        var index = oldNotes.indexOf(note);
                        if (index == -1) {
                            index = oldNotesBemol.indexOf(note);
                            if (index == -1) return note;
                            else return newNotesBemol[index];
                        }
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

        get youtube() {
            return this._youtube;
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
            return this._versao || 'Original';
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
                if (arr[i] == undefined || arr[i + 1] == undefined) throw nome + ' esta incompleta';

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

        set parte(parte) {
            this._numParte++;
            this.addEstrofe(`PARTE ${this._numParte}`, this.clear(parte), 'PARTE');
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

        convertNoteToUpper(note) {
            return note.replace(/([a-g]|[A-G])#?b?/g, (note) => {
                return note.toUpperCase();
            });
        }
    };

    Pi.Export('Music.Lyrics', Lyrics);
});