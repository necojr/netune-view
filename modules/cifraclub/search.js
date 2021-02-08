yum.define([
    Pi.Url.create('CifraClub', '/client.js'),
    Pi.Url.create('CifraClub', '/converter.js')
], function (html) {

    class Control extends Pi.Component {

        instances() {
            this.view = new Pi.View(`<div class="page page-with-subnavbar">
                <div class="navbar">
                    <div class="navbar-bg"></div>
                    <div class="navbar-inner">
                        <div class="left">
                            <a href="javascript:void(0)" id="backPage" class="link back">
                                <i class="icon icon-back"></i>
                            </a>
                        </div>
                        <div class="title">Cifra Club</div>
                        <div class="subnavbar">
                            <form class="searchbar">
                                <div class="searchbar-inner">
                                    <div class="searchbar-input-wrap">
                                        <input id="textbox" type="search" placeholder="Pesquisa">
                                        <i class="searchbar-icon"></i>
                                        <span class="input-clear-button"></span>
                                    </div>
                                    <span class="searchbar-disable-button">Limpar</span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="page-content">
                    <div class="searchbar-backdrop"></div>

                    <div class="list media-list searchbar-found">
                        <ul at="list"></ul>
                    </div>

                </div>
                
            </div>`);

            this.list = new Pi.ElementList({
                template: `<li>
                    <a data-event-click="@{nome}" href="javascript:void(0)" class="item-link item-content">
                        <div class="item-media">
                            <img src="@{preview}" width="40">
                        </div>
                        <div class="item-inner">
                            <div class="item-title-row">
                                <div class="item-title">@{nome}</div>
                            </div>
                            <div class="item-subtitle">@{grupo}</div>
                        </div>
                    </a>
                </li>`
            });

            this.client = new CifraClub.Client();
        }

        viewDidLoad() {
            this.initSearchBar();

            super.viewDidLoad();
        }

        initSearchBar() {
            var self = this;
            // app.f7.searchbar.create({
            //     el: '.searchbar',
            //     searchContainer: '.list',
            //     searchIn: '.item-title',
            //     on: {
            //         search(sb, query, previousQuery) {
            //             self.search(query);
            //         }
            //     }
            // });
        }

        search(query){
            this.client.search(query).ok((response) => {
                this.popule(response.musicas);
            }).error(() => {
                app.notification('Atenção!', 'Sem conexão com a internet');
            });
        }

        popule(musicas){
            this.list.load(musicas);
        }

        events(listen){
            super.events(listen);
        
            listen({
                '#textbox keyup'() { 
                    this.search(this.view.textbox.get());
                },

                '{list} click': function (_, music) {
                    this.event.trigger('select', music);
                    app.popPage();
                }
            });
        }

    };

    Pi.Export('CifraClub.Search', Control);
});