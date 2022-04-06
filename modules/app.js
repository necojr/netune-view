yum.define([

], function () {

    class App extends Pi.App {

        instances() {
            this.pages = [];
            this.env = 'minimal';
            this.omniGroupName = 'netune:cifras';
        }

        viewDidLoad() {
            this.initFramework7();
            this.loadModules();
        }

        servicesWillLoad() {

        }

        loadModules() {
            app.loading(true);
            yum.download([
                Pi.Url.create('Music', '/list.js'),
                Pi.Url.create('Music', '/popup.js'),
                Pi.Url.create('Music', '/page.js'),
                Pi.Url.create('Music', '/editor.js'),
                Pi.Url.create('Music', '/model.js'),
                Pi.Url.create('Omni', '/client.js'),
                Pi.Url.create('User', '/model.js'),
                Pi.Url.create('User', '/page.js'),
                Pi.Url.create('Workspace', '/page.js')
            ], () => {
                app.loading(false);

                this.removeSplash();
                this.initComponents();
                this.initEvents();
                this.initEnv();

                this.loadUser();

                super.viewDidLoad();
            });
        }

        removeSplash() {
            this.view.get('pages').show();
            this.view.get('initialize').hide();
            document.body.classList.add('wallpaper-02');
        }

        initFramework7() {
            this.f7 = new Framework7({
                el: '#' + this.view.id,
                name: 'Netune',
                id: 'br.com.atos239.netune',
            });
        }

        initComponents() {
            this.omni = new Omni.Client();
            this.omni.connect();

            this.musicPopup = new Music.Popup();
            this.musicPopup.render(this.view.get('musicPopup'));

            this.musicList = new Music.List({
                empty: 'Nenhuma Música Adicionada'
            });

            this.musicList.render(this.view.get('musicList'));
        }

        initEvents() {
            document.addEventListener('backbutton', () => {
                this.popPage();
            });
        }

        initEnv() {
            if (this.env != 'full') {
                this.view.findById('addMusic').hide();
                this.view.findById('createMusic').hide();
            }
        }

        loadUser() {
            app.loading(true);
            User.Model.current().ok((user) => {
                app.loading(false);

                this.setUser(user);
                this.loadWorkspace();

                super.servicesWillLoad();
            });
        }

        setUser(user) {
            app.user = user;
            this.view.get('changeUser').show();
            this.view.get('avatarUrl').src = user.avatar;
        }

        setWorkspace(w) {
            this.view.get('workspaceNome').set(w.nome);
        }

        loadWorkspace() {
            app.loading(true);
            this.user.loadWorkspace().ok((workspace) => {
                app.loading(false);

                this.musicList.clear();
                this.musicList.load(workspace.musicas);

                this.setWorkspace(workspace);
            });
        }

        openModal(modal) {
            modal.render(app.view.element);
            modal.open();

            return modal;
        }

        addPage(page) {
            this.pages.push(page);
            page.render(this.view.get('pages'));

            return page;
        }

        get currentPage() {
            if (this.pages.length == 0) return null;
            return this.pages[this.pages.length - 1];
        }

        popPage() {
            if (this.currentPage == null) return;
            this.currentPage.destroy();
            this.pages.pop();
            window.location = '#';
        }

        loading(b) {
            if (b) app.f7.preloader.show();
            else app.f7.preloader.hide();

            return this;
        }

        notification(title, subtitle = '', message = '') {
            var n = app.f7.notification.create({
                title: title,
                subtitle: subtitle,
                text: message,
                closeButton: true,
            });

            n.open();
        }

        saveWorkspace() {
            this.user.workspace.musicas = this.musicList.get();

            this.loading(true);
            this.user.workspace.save().done(() => {
                this.loading(false);

                this.omni.trigger('reload:workspace', this.omniGroupName, this.user.workspace);
            }).error(() => {
                app.notification('Atenção!', 'Sem conexão com a internet');
            });
        }

        events(listen) {
            super.events(listen);

            listen({
                // '#changeUser click'() {
                    // this.addPage(new User.Page()).event.listen('update', () => {
                    //     this.setUser(app.user);
                    // });
                // },

                // '#changeWorkspace click'() {
                    // this.addPage(new Workspace.Page()).event.listen('select', () => {
                    //     this.loadWorkspace()
                    // });
                // },

                '#addMusic click'() {
                    this.musicPopup.open();
                },

                '#createMusic click'() {
                    this.addPage(new Music.Editor({
                        musica: new Music.Model()
                    }));
                },

                '{omni} connected'() {
                    this.omni.enter(this.omniGroupName);
                },

                '{omni} reload:workspace'(workspace) {
                    if (this.user.workspace.id == workspace.id) {
                        this.loadWorkspace();
                    }
                },

                '{omni} new:tom'(musica) {
                    for (let i = 0; i < this.user.workspace.musicas.length; i++) {
                        const m = this.user.workspace.musicas[i];
                        if (m.id == musica.id) {
                            this.loadWorkspace();
                            break;
                        }
                    }
                },

                '{omni} update:musica'(musica) {
                    for (let i = 0; i < this.user.workspace.musicas.length; i++) {
                        const m = this.user.workspace.musicas[i];
                        if (m.id == musica.id) {
                            this.loadWorkspace();
                            break;
                        }
                    }
                },

                '{this} save:music'(musica) {
                    for (let i = 0; i < this.user.workspace.musicas.length; i++) {
                        const m = this.user.workspace.musicas[i];
                        if (m.id == musica.id) {
                            this.loadWorkspace();
                            break;
                        }
                    }
                },

                '{musicPopup} choose'(musicas) {
                    this.musicList.load(musicas);

                    this.saveWorkspace();
                },

                '{musicList} delete'() {
                    this.saveWorkspace();
                },

                '{musicList} select'(musica) {
                    this.addPage(new Music.Page({
                        musica: musica
                    }));
                },

                '{musicList} reorder'(){
                    this.saveWorkspace();
                }
            });
        }
    }

    Pi.Export('App', App);
});