yum.define([
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
                        <div class="title" id="title">Perfil</div>
                        <div class="right">
                            <a href="javascript:void(0)" id="save" class="link back">
                                <i class="icon material-icons md-only">save</i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="page-content">
                    <div class="">
                        <ul class="list" style="padding: 0px;">
                            <li class="item-content item-input">
                                <div class="item-inner">
                                    <div class="item-title item-label">
                                        Seu Nome
                                        <div class="item-input-wrap">
                                            <input id="nome" name="nome" type="text" placeholder="Seu nome">
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="item-content item-input">
                                <div at="avatars"></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>`);
            
            this.avatars = new Pi.ElementList({
                template: '<div class="user-page-img"><div data-event-click="@{url}"><img width="48" src="@{url}"></div></div>'
            });
        }

        viewDidLoad() {
            this.loadUser();
            this.loadAvatars();

            super.viewDidLoad();
        }

        loadAvatars() {
            var images = [];

            for (let i = 0; i < 50; i++) {
                images.push({ url: `/images/avatar/0${i + 1}.png` });
            }
            
            this.avatars.load(images);
        }

        loadUser(){
            this.view.get('nome').set(app.user.nome);
        }

        events(listen){
            super.events(listen);
        
            listen({
                '#backPage click'() {
                    app.popPage();
                },

                '#save click'() {
                    app.user.avatar = this.avatarUrl || app.user.avatar;
                    app.user.nome = this.view.get('nome').get();

                    app.loading(true);
                    app.user.save().ok(() => {
                        this.event.trigger('update');
                        app.popPage();
                    }).error(() => {
                        app.notification('Atenção!', 'Sem conexão com a internet');
                    }).done(() => {
                        app.loading(false);
                    });
                },

                '{avatars} click': function (url, model, el) {
                    this.view.element.query().find('.user-page-img-selected').removeClass('user-page-img-selected');
                    el.children[0].query().addClass('user-page-img-selected');
                    this.avatarUrl = url;
                }
            });
        }

    };

    Pi.Export('User.Page', Control);
});