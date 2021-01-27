yum.define([
    Pi.Url.create('Workspace', '/model.js')
], function(html){

    class Control extends Pi.Component{

        instances(){
            this.view = new Pi.View(`<div class="page">
                <div class="navbar">
                    <div class="navbar-bg"></div>
                    <div class="navbar-inner">
                        <div class="left">
                            <a href="javascript:void(0)" id="backPage" class="link back">
                                <i class="icon icon-back"></i>
                            </a>
                        </div>
                        <div class="title" id="title">Playlists</div>
                        <div class="right">
                            <a href="javascript:void(0)" id="create" class="link back">
                                <i class="fas fa-plus"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="page-content">
                    <div class="list media-list"><ul at="_list"></ul></div>
                </div>
            </div>`);

            this._list = new Pi.ElementList({
                template: `<li>
                    <a href="javascript:void(0)" class="item-link item-content" data-name-op="select" data-event-click="@{id}">
                        <div class="item-media">
                            <img src="@{user.avatar}" width="40">
                        </div>
                        <div class="item-inner">
                            <div class="item-title-row">
                                <div class="item-title">@{nome}</div>
                                <!--<div class="item-after" data-name-op="delete" data-event-click="@{id}">
                                    <i class="far fa-trash-alt"></i>
                                </div>-->
                            </div>
                            <div class="item-subtitle">@{user.nome}</div>
                        </div>
                    </a>
                </li>`
            });

            this.model = new Workspace.Model();
        }

        viewDidLoad(){
            this.load();
            
            super.viewDidLoad();
        }

        load() {
            app.loading(true)
            this.model.all().ok(this.popule, this).error(() => {
                app.notification('Atenção!', 'Sem conexão com a internet');
            }).done(() => {
                app.loading(false)
            });
        }

        popule(works){
            this._list.load(works);
        }

        events(listen){
            super.events(listen);
        
            listen({
                '#backPage click'() {
                    app.popPage();
                },

                '#create click'() {
                    app.f7.dialog.prompt('Informe o nome da lista', 'Netune Cifras', (nome) => {
                        this.model.nome = nome;
                        this.model.userid = app.user.id;
                        
                        app.loading(true);
                        this.model.insert().ok(() => {
                            this.load();
                        }).error(() => {
                            app.notification('Atenção!', 'Sem conexão com a internet');
                        }).done(() => {
                            app.loading(false);
                        });
                    });
                },

                '{_list} click': function (_, workspace, el, event) {
                    var op = el.getAttribute('data-name-op');

                    switch (op) {
                        case 'select':
                            app.loading(true);
                            app.user.changeWorkspace(workspace.id).ok(() => {
                                this.event.trigger('select', workspace);
                                app.popPage();
                            }).error(() => {
                                app.notification('Atenção!', 'Sem conexão com a internet');
                            }).done(() => {
                                app.loading(false);
                            });
                            break;
                    
                        case 'delete':
                            this.load();
                            break;
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            });
        }

    };

    Pi.Export('Workspace.Page', Control);
});