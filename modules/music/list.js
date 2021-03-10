yum.define([

], function (html) {

    class Control extends Pi.Component {

        instances() {
            this.view = new Pi.View(`<div class="list media-list"><ul at="_list"></ul></div>`);

            this._list = new Pi.ElementList({
                template: `<li>
                    <a href="javascript:void(0)" class="item-link item-content" data-name-op="open" data-event-click="@{id}">
                        <div class="item-media">
                            <i style="font-size: 24px;color: #6200ee;padding: 9px;" class="fas fa-music"></i>
                        </div>
                        <div class="item-inner">
                            <div class="item-title-row">
                                <div class="item-title">@{nome}</div>
                                <div style="display: ${app.env == 'minimal' ? 'none' : 'block'}" class="item-after" data-name-op="delete" data-event-click="@{id}">
                                    <i class="far fa-trash-alt"></i>
                                </div>
                            </div>
                            <div class="item-subtitle">@{versao}</div>
                        </div>
                    </a>
                </li>`
            });
        }

        add(music) {
            if (this.exist(music)) return;

            this._list.add(music);
        }

        load(musics) {
            for (let i = 0; i < musics.length; i++) {
                this.add(musics[i]);
            }
        }

        exist(music) {
            return this._list.exist((m) => m.id == music.id);
        }

        get() {
            return this._list.all();
        }

        clear() {
            this._list.clear();

            return this;
        }

        events(listen) {
            super.events(listen);

            listen({
                '{_list} click': function (_, music, el, event) {
                    var op = el.getAttribute('data-name-op');

                    switch (op) {
                        case 'open':
                            this.event.trigger('select', music);
                            break;

                        case 'delete':
                            this._list.remove(el.parents(4));
                            event.stopPropagation();
                            event.preventDefault();

                            this.event.trigger('delete', music);
                            break;
                    }
                }
            });
        }

    };

    Pi.Export('Music.List', Control);
});