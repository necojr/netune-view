yum.define([
    Pi.Url.create('Music', '/parser.js'),
    Pi.Url.create('Vendor', '/codemirror/editor.js'),
    Pi.Url.create('Vendor', '/codemirror/music.js'),
    Pi.Url.create('CifraClub', '/search.js')
], function (html) {

    class Control extends Pi.Component {

        instances() {
            this.view = new Pi.View(`<div class="page">
                <div class="navbar">
                    <div class="navbar-bg"></div>
                    <div class="navbar-inner">
                        <div class="left">
                            <a href="javascript:void(0)" id="backPage" class="link back">
                                <i class="icon icon-back"></i>
                            </a>
                        </div>
                        <div class="title" id="title">Título</div>
                        <div class="right">
                            <a href="javascript:void(0)" id="import" class="link back">
                                <i class="fas fa-search" style="font-size: 26px!important;"></i>
                            </a>
                            <a href="javascript:void(0)" id="save" class="link back">
                                <i class="fas fa-save" style="font-size: 26px!important; color: #6200ee;"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="page-content">
                    <div at="editor"></div>
                </div>
            </div>`);

            this.editor = new CodeMirrorEditor({
                mode: new CodeMirrorModeMusic()
            });
        }

        viewDidLoad() {
            this.loadModeMusic();

            super.viewDidLoad();
        }

        loadModeMusic() {
            var keywords = ['youtube', 'nome', 'musica', 'titulo', 'intro', 'tom', 'versao', 'parte', 'estrofe', 'ponte', 'coro'];

            for (let i = 0; i < keywords.length; i++) {
                this.editor.mode.addLookup(keywords[i], CodeMirrorModeMusicType.TITLE);
            }
        }

        set(musica) {
            var parser = new Music.Parser();
            this.musica = musica;

            this.view.get('title').set(this.musica.nome);
            this.editor.set(parser.parse(musica.lyrics).text);
        }

        events(listen) {
            super.events(listen);

            listen({
                '#import click'() {
                    app.addPage(new CifraClub.Search()).event.listen('select', (musica) => {
                        app.loading(true);
                        CifraClub.Client.create().get(musica.url).ok((client) => {
                            this.editor.set(client.lyrics);
                        }).error(() => {
                            app.notification('Atenção!', 'Sem conexão com a internet');
                        }).done(() => {
                            app.loading(false);
                        });
                    });
                },

                '#save click'() {
                    if (this.musica == null) return;

                    try {
                        var parser = new Music.Parser();
                        var letra = this.editor.get();

                        var lyrics = parser.parse(letra);
                        this.musica.nome = lyrics.titulo;
                        this.musica.versao = lyrics.versao;
                        this.musica.youtube = lyrics.youtube;
                        this.musica.tom = lyrics.tom;
                        this.musica.lyrics = letra;

                        if (this.musica.nome.length == 0) {
                            throw {
                                message: 'Informe o nome da música'
                            };
                        }

                        if (this.musica.tom.length == 0) {
                            throw {
                                message: 'Informe o tom da música'
                            };
                        }

                        app.loading(true);
                        this.musica.save().ok(() => {
                            app.event.trigger('save:music', this.musica);
                            app.popPage();
                        }).error(() => {
                            app.notification('Atenção!', 'Sem conexão com a internet');
                        }).done(() => {
                            app.loading(false);
                        });

                    } catch (error) {
                        app.notification('Atenção!', 'Cifra não esta formatada corretamente.', error.message);
                    }
                },

                '#backPage click': function () {
                    app.popPage();
                }
            });
        }

    };

    Pi.Export('Music.Editor', Control);
});