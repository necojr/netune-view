yum.define([

], function () {

    class App extends Pi.App {

        instances() {
            this.pages = [];

            this.workspace = new Workspace.Model();

            this.omni = new Omni.Client();
        }

        viewDidLoad() {
            this.initFramework7();
            this.loadModules();

            super.viewDidLoad();
        }

        loadModules() {
            app.loading(true);
            yum.download([
                Pi.Url.create('Music', '/list.js'),
                Pi.Url.create('Music', '/choose.js'),
                Pi.Url.create('Music', '/popup.js'),
                Pi.Url.create('Music', '/page.js'),
                Pi.Url.create('Workspace', '/model.js'),
                Pi.Url.create('Music', '/editor.js'),
                Pi.Url.create('Music', '/model.js'),
                Pi.Url.create('Omni', '/client.js')
            ], () => {
                app.loading(false);

                this.initComponents();
                this.loadWorkspace();
            });
        }

        initFramework7() {
            this.f7 = new Framework7({
                el: '#' + this.view.id,
                name: 'Netune',
                id: 'br.com.atos239.netune',
            });
        }

        initComponents() {
            this.musicChoose = new Music.Choose();
            this.musicChoose.render(this.view.get('musicChoose'));

            this.musicPopup = new Music.Popup();
            this.musicPopup.render(this.view.get('musicPopup'));

            this.musicList = new Music.List({
                empty: 'Nenhuma Música Adicionada'
            });

            this.musicList.render(this.view.get('musicList'));
        }

        loadWorkspace() {
            app.loading(true);
            this.workspace.current().ok((workspace) => {
                app.loading(false);

                this.workspace = workspace;
                this.musicList.clear();
                this.musicList.load(workspace.musicas);

                this.omni.open();
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
        }

        get currentPage() {
            if (this.pages.length == 0) return null;
            return this.pages[this.pages.length - 1];
        }

        popPage() {
            this.currentPage.destroy();
            this.pages.pop();
            window.location = '#';
        }

        loading(b) {
            if (b) app.f7.preloader.show();
            else app.f7.preloader.hide();

            return this;
        }

        events(listen) {
            super.events(listen);

            listen({
                '#addMusic click'() {
                    this.musicPopup.open();
                },

                '#createMusic click'() {
                    this.addPage(new Music.Editor({
                        musica: new Music.Model()
                    }));
                },

                '{omni} connected'() {
                    this.omni.enter(this.workspace.name);
                },

                '{this} save:music'() {
                    this.loadWorkspace();
                },

                '{musicPopup} choose'(musicas) {
                    this.musicList.load(musicas);

                    this.workspace.musicas = this.musicList.get();
                    this.workspace.save();
                },

                '{musicList} delete'() {
                    this.workspace.musicas = this.musicList.get();
                    this.workspace.save();
                },

                '{musicList} select'(musica) {
                    this.addPage(new Music.Page({
                        musica: musica
                    }))
                }
            });
        }
    }

    Pi.Export('App', App);
});