yum.define([
    Pi.Url.create('Music', '/model.js')
], function (html) {

    class Control extends Pi.Component {

        instances() {
            this.view = new Pi.View(`<div class="page popup">
                <div class="navbar">
                    <div class="navbar-bg"></div>
                    <div class="navbar-inner">
                        <div class="left">
                            <a href="javascript:void(0)" id="backPage" class="link back">
                                <i class="icon icon-back"></i>
                            </a>
                        </div>
                        <div class="title">Music List</div>
                        <div class="right">
                            <a href="javascript:void(0)" id="add" class="link back">
                                <i class="fas fa-plus" style="color: #6200ee;"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="page-content">
                    <div class="list media-list no-hairlines"><ul at="_list"></ul></div>
                </div>
            </div>`);

            this.musics = new Pi.Collection();

            this._tags = new Pi.ElementList({
                template: `<div class="chip" style="margin:4px;">
                    <div class="chip-media bg-color-pink">@{tag}</div>
                    <div class="chip-label">@{nome}</div>
                    <a href="#" data-event-click="@{id}" class="chip-delete"></a>
                </div>`
            });

            this._list = new Pi.ElementList({
                template: `<li>
                    <label class="item-checkbox item-content" data-event-click="@{id}">
                        <input type="checkbox" name="123" value="@{nome}">
                        <i class="icon icon-checkbox"></i>
                        <div class="item-inner">
                            <div class="item-title-row">
                                <div class="item-title">@{nome}</div>
                                <div class="item-after" style="color: #6200ee;"></div>
                            </div>
                            <div class="item-subtitle">@{versao}</div>
                        </div>
                    </label>
                </li>`
                // template: `<li>
                //     <a href="javascript:void(0)" class="item-link item-content" data-event-click="@{id}">
                //         <div class="item-inner">
                //             <div class="item-title-row">
                //                 <div class="item-title">@{nome}</div>
                //                 <div class="item-after" style="color: #6200ee;"></div>
                //             </div>
                //             <div class="item-subtitle">@{versao}</div>
                //         </div>
                //     </a>
                // </li>`
            });
        }

        viewDidLoad() {
            this.createPopup();

            super.viewDidLoad();
        }

        open() {
            this.popup.open();
            this.load();

            return this;
        }

        load() {
            var model = new Music.Model();

            app.loading(true);
            model.all().ok((musicas) => {
                app.loading(false);

                this._list.load(musicas);
            });
        }

        createPopup() {
            this.popup = app.f7.popup.create({
                content: '#' + this.view.id,
                swipeToClose: true,
            });
        }

        destroy() {
            this.popup.close();
        }

        events(listen) {
            super.events(listen);

            listen({
                '{_list} click'(_, music, el, e) {
                    if (this.musics.exist(m => m.id == music.id)) {
                        this.musics.remove(m => m.id == music.id);
                        el.children[1].checked = false;
                    } else {
                        this.musics.push(music);
                        el.children[1].checked = true;
                    }

                    e.stopPropagation();
                    e.preventDefault();
                },

                '(app) save:music'() {
                    this.load();
                },

                // '{_tags} click'(_, music, el) {
                //     this._tags.remove(el.parent());
                // },

                '#add click'() {
                    this.event.trigger('choose', this.musics);
                    this.destroy();
                },

                '#backPage click'() {
                    this.destroy();
                }
            });
        }

    };

    Pi.Export('Music.Popup', Control);
});