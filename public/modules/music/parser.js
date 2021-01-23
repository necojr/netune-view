yum.define([
    Pi.Url.create('Music', '/lyrics.js'),
    Pi.Url.create('Lexicon', '/automate.js')
], function(){

    class Parser extends Pi.Class {

        instances() {
            this.automate = new Lexicon.Automate();
            this.tags = ['youtube', 'nome', 'musica', 'titulo', 'intro', 'tom', 'versao', 'estrofe', 'ponte', 'coro'];

            this.automate.add(0, 0, ['[empty]']);
            this.automate.add(0, 1, ['estrofe', 'ponte', 'coro']);
            this.automate.add(1, 2, ['[text]']);
            this.automate.add(1, 4, ['[empty]']);
            this.automate.add(4, 4, ['[empty]']);
            this.automate.add(4, 2, ['[text]']);
            this.automate.add(2, 2, ['[text]', '[empty]']);
            this.automate.add(2, 3, ['[empty]']);
            this.automate.add(2, 3, ['[done]']);
            this.automate.add(2, 3, this.tags);
            this.automate.add(0, 4, ['youtube', 'nome', 'musica', 'titulo', 'intro', 'tom', 'versao']);
            this.automate.add(4, 5, ['[text]']);
            this.automate.add(4, 6, ['[empty]']);
            this.automate.add(6, 6, ['[empty]']);
            this.automate.add(6, 5, ['[text]']);
            this.automate.add(5, 3, ['[empty]']);
            this.automate.add(5, 3, ['[done]']);
            this.automate.add(5, 3, this.tags);
            this.automate.doneOn(3);
        }

        parse(text) {
            var lyrics = new Music.Lyrics();
            var linhas = text.replace(/\r/gi, '').split('\n');
            var values = [];

            this.automate.onStart(() => {
                values = [];
            });

            this.automate.onDone(() => {
                const events = this.automate.events;
                lyrics.add(events[0], values);
            });

            for (let i = 0; i < linhas.length; i++) {
                const linhaRaw = linhas[i];
                const linha = this.clear(linhaRaw);
                const event = this.convertToEvent(linha);

                this.automate.onStep(() => {
                    values.push(linhaRaw);
                });

                this.automate.onInvalid(() => {
                    throw 'Erro na linha ' + (i + 1);
                });

                this.automate.trigger(event);
            }

            this.automate.onStep(null);
            this.automate.trigger('[done]');

            return lyrics;
        }

        convertToEvent(linha) {
            if (this.tags.indexOf(linha) > -1) return linha;
            if (linha.length == 0) return '[empty]';

            return '[text]';
        }

        isEmpty(linha) {
            return linha.length == 0;
        }

        clear(linha) {
            linha = linha.replace(/\s/gi, '');
            linha = linha.replace(/\t/gi, '');

            return linha.toLowerCase();
        }

    };

    Pi.Export('Music.Parser', Parser);
});