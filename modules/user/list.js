yum.define([
    Pi.Url.create('User', '/model.js')
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
                        <div class="title" id="title">Avatar</div>
                        <div class="right">
                            <a href="javascript:void(0)" id="clear" class="link back">
                                <i class="fas fa-trash"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="page-content">
                    <div class="list">
                        <ul at="list"></ul>
                    </div>
                </div>
            </div>`);

            this.list = new Pi.ElementList({
                template: `<li>
                    <a data-event-click="@{id}" href="javascript:void(0)" class="item-link item-content">
                        <div class="item-media">
                            <img width="48" src="@{avatar}">
                        </div>
                        <div class="item-inner">
                            <div class="item-title">@{nome}</div>
                            <div class="item-after"></div>
                        </div>
                    </a>
                </li>`
            });

            this.model = new User.Model();
        }

        viewDidLoad(){
            this.load();

            super.viewDidLoad();
        }

        load(){
            app.loading(true);
            this.model.all().ok(this.popule, this).error((message) => {
                app.notification('Atenção!', '', message);
            }).done(() => {
                app.loading(false);
            });
        }

        popule(users){
            this.list.load(users);
        }

        events(listen){
            super.events(listen);
        
            listen({
                '#backPage click'() {
                    app.popPage();
                },

                '#clear click'() {
                    this.event.trigger('clear');
                    app.popPage();
                },

                '{list} click'(_, user){
                    this.event.trigger('select', user);
                    app.popPage();
                }
            });
        }

    };

    Pi.Export('User.List', Control);
});