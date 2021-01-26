yum.define([
    Pi.Url.create('Music', '/slider.js'),
    Pi.Url.create('Music', '/parser.js'),
    Pi.Url.create('Music', '/editor.js')
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
                            <a href="javascript:void(0)" id="youtube" class="link back">
                                <i class="ffab fa-youtube" style="font-size: 32px; color: #ff3300;"></i>
                            </a>
                            <a href="javascript:void(0)" id="trocaTom" class="link back">
                                <i class="icon material-icons md-only">audiotrack</i>
                                <span id="tom"></span>
                            </a>
                        </div>
                    </div>
                </div>
                <div at="slider" class="page-content"></div>
                <div class="fab fab-extended fab-right-bottom">
                    <a id="editMusic" href="javascript:void(0)">
                        <i class="icon material-icons md-only">edit</i>
                    </a>
                </div>
            </div>`);

            this.slider = new Music.Slider();
            this.parser = new Music.Parser();
        }

        viewDidLoad() {
            this.set(this.musica);

            super.viewDidLoad();
        }

        trocarTom(newTom) {
            this.updateTom(newTom);

            this.musica.tom = newTom;
            this.musica.save();

            app.omni.trigger('new:tom', app.omniGroupName, this.musica);
        }

        updateTom(newTom) {
            this.view.get('tom').set(newTom);
            this.lyrics.trocarTom(newTom);
            this.slider.load(this.lyrics);
            this.musica.lyrics = this.lyrics.text;
        }

        set(musica) {
            this.musica = musica;

            this.lyrics = this.parser.parse(this.musica.lyrics);
            this.lyrics.trocarTom(this.musica.tom);

            if (this.lyrics._youtube.length == 0) {
                this.view.get('youtube').hide()
            }
            
            this.view.get('title').set(this.musica.nome);
            this.view.get('tom').set(this.musica.tom);

            this.slider.load(this.lyrics);
        }

        events(listen) {
            super.events(listen);

            listen({
                '#backPage click'() {
                    app.popPage();
                },

                '#editMusic click'() {
                    var page = new Music.Editor();
                    page.set(this.musica);
                    app.addPage(page);
                },

                '(app) save:music'(musica) {
                    if (this.musica.id == musica.id) {
                        this.set(musica);
                        app.omni.trigger('update:musica', app.omniGroupName, musica);
                    }
                },

                '#youtube click'() {
                    var p = app.f7.popup.create({
                        content: `<div class="popup">
                                <div class="navbar">
                                    <div class="navbar-bg"></div>
                                    <div class="navbar-inner">
                                        <div class="left">
                                            <a href="#" class="link popup-close">
                                                <i class="icon icon-back"></i>
                                            </a>
                                        </div>
                                        <div class="title">Youtube</div>
                                        <div class="right"></div>
                                    </div>
                                </div>
                                <div class="block">
                                    <div class="yt-container">
                                        <iframe width="320" src="${this.lyrics._youtube}" frameborder="0" allowfullscreen class="video"></iframe>
                                    </div>
                                </div>
                            </div>`,
                        swipeToClose: true,
                    });

                    p.open();
                },

                '#trocaTom click'() {
                    var action = app.f7.actions.create({
                        buttons: [{
                            text: 'C',
                            onClick: () => {
                                this.trocarTom('C');
                            }
                        }, {
                            text: 'C#',
                            onClick: () => {
                                this.trocarTom('C#');
                            }
                        }, {
                            text: 'D',
                            onClick: () => {
                                this.trocarTom('D');
                            }
                        }, {
                            text: 'D#',
                            onClick: () => {
                                this.trocarTom('D#');
                            }
                        }, {
                            text: 'E',
                            onClick: () => {
                                this.trocarTom('E');
                            }
                        }, {
                            text: 'F',
                            onClick: () => {
                                this.trocarTom('F');
                            }
                        }, {
                            text: 'F#',
                            onClick: () => {
                                this.trocarTom('F#');
                            }
                        }, {
                            text: 'G',
                            onClick: () => {
                                this.trocarTom('G');
                            }
                        }, {
                            text: 'G#',
                            onClick: () => {
                                this.trocarTom('G#');
                            }
                        }, {
                            text: 'A',
                            onClick: () => {
                                this.trocarTom('A');
                            }
                        }, {
                            text: 'A#',
                            onClick: () => {
                                this.trocarTom('A#');
                            }
                        }, {
                            text: 'B',
                            onClick: () => {
                                this.trocarTom('B');
                            }
                        }]
                    });

                    action.open();
                }
            });
        }

    };

    Pi.Export('Music.Page', Control);
});