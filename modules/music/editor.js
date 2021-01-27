yum.define([
    Pi.Url.create('Music', '/parser.js')
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
                            <a href="javascript:void(0)" id="save" class="link back">
                                <i class="fas fa-save" style="font-size: 26px; color: #6200ee;"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="page-content">
                    <textarea placeholder="\nMusica\nGrande é o Senhor\n\nTom\nA\n\nEstrofe\nA\nGrande é o senhor e muito digno de louvor\nD                  E\nNa cidade do nosso Deus, seu santo monte\nA\nAlegria de toda terra\n\nEstrofe\nA\nGrande é o senhor em quem nós temos a vitória\nD              E       A   \nQue nos ajuda contra o inimigo\nA                         Bm7     A/C#\nPor isso diante dele nos prostramos\n\nCoro\nA                      C#m\nQueremos o seu nome engrandecer\nA           A/C#       D             E            \nE agradecer-te por tua obra em nossa vida\nA                         C#m7\nConfiamos em teu infinito amor\n      D         A/C#        Bm7        E       A\nPois só tu és o Deus eterno sobre toda terra e céus" id="textarea" style="width: 100%; height: 100%"></textarea>
                </div>
            </div>`);
        }

        viewDidLoad() {

            super.viewDidLoad();
        }

        set(musica) {
            this.musica = musica;

            this.view.get('title').set(this.musica.nome);
            this.view.get('textarea').set(musica.lyrics);
        }

        events(listen) {
            super.events(listen);

            listen({
                '#save click'() {
                    if (this.musica == null) return;

                    try {
                        var parser = new Music.Parser();
                        var letra = this.view.textarea.get();

                        var lyrics = parser.parse(letra);
                        this.musica.nome = lyrics.titulo;
                        this.musica.versao = lyrics.versao;
                        this.musica.youtube = lyrics.youtube;
                        this.musica.tom = lyrics.tom;
                        this.musica.lyrics = letra;

                        if (this.musica.nome.length == 0) {
                            throw 'Informe o nome da música';
                        }

                        if (this.musica.tom.length == 0) {
                            throw 'Informe o tom da música';
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
                        app.notification('Atenção!', 'Cifra não esta formatada corretamente', error);
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