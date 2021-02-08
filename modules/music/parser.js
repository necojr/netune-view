yum.define([
    Pi.Url.create('Music', '/lyrics.js'),
    Pi.Url.create('Lexicon', '/automate.js')
], function () {

    class Parser extends Pi.Class {

        instances() {
            this.automates = [];

            this.keywordsInfo = ['youtube', 'nome', 'musica', 'titulo', 'intro', 'tom', 'versao'];
            this.keywordsMusic = ['parte', 'estrofe', 'ponte', 'coro'];

            this.automates.push(new Lexicon.Automate({ name: 'music' }));
            this.automates[0].add(0, 0, this.keywordsInfo.concat(['[text]', '[empty]', '[done]']));
            this.automates[0].add(0, 1, this.keywordsMusic);
            this.automates[0].add(1, 2, ['[text]']);
            this.automates[0].add(2, 4, ['[text]']);
            this.automates[0].add(4, 2, ['[text]']);
            this.automates[0].add(4, 1, this.keywordsMusic);
            this.automates[0].add(4, 3, this.keywordsInfo.concat(['[empty]', '[done]']));
            this.automates[0].stepRestart(4, 1);
            this.automates[0].stepFinish(3);
            
            this.automates.push(new Lexicon.Automate({ name: 'info' }));
            this.automates[1].add(0, 0, this.keywordsMusic.concat(['[text]', '[empty]', '[done]']));
            this.automates[1].add(0, 1, this.keywordsInfo);
            this.automates[1].add(1, 2, ['[text]']);
            this.automates[1].add(2, 1, this.keywordsInfo);
            this.automates[1].add(2, 3, this.keywordsMusic.concat(['[text]', '[empty]', '[done]']));
            this.automates[1].stepRestart(2, 1);
            this.automates[1].stepFinish(3);
        }

        parse(text) {
            var lyrics = new Music.Lyrics();
            var linhas = text.replace(/\r/gi, '').split('\n');
            var values = [];
            var automates = this.automates;

            for (let j = 0; j < automates.length; j++) {
                automates[j].reset().enable(true);
            }

            for (let i = 0; i < automates.length; i++) {
                automates[i].onStart(() => {
                    values = [];
                });

                automates[i].onRestart(function () {
                    const events = this.events;
                    lyrics.add(events[0], values);
                    values = [];
                });

                automates[i].onDone(function () {
                    const events = this.events;
                    lyrics.add(events[0], values);

                    for (let j = 0; j < automates.length; j++) {
                        automates[j].reset().enable(true);
                    }
                });
            }

            for (let i = 0; i < linhas.length; i++) {
                const linhaRaw = linhas[i];
                const linha = this.clear(linhaRaw);
                const event = this.convertToEvent(linha);
                if (event == '[empty]') continue;

                for (let j = 0; j < automates.length; j++) {
                    const automate = automates[j];

                    automate.onStep(function () {
                        values.push(linhaRaw);
                    });

                    automate.onInvalid(function (step) {
                        // if (step == 0) this.reset().enable(false);
                        // else
                        throw {
                            message: 'Linha ' + (i + 1) + ' esta errada',
                            line: i + 1
                        };
                    });

                    automate.trigger(event);
                }
            }

            for (let i = 0; i < automates.length; i++) {
                const automate = automates[i];
                automate.onStep(null);
                automate.trigger('[done]');
            }

            return lyrics;
        }

        convertToEvent(linha) {
            if (this.keywordsInfo.indexOf(linha) > -1) return linha;
            if (this.keywordsMusic.indexOf(linha) > -1) return linha;
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