yum.define([
    Pi.Url.create('Workspace', '/model.js')
], function () {

    class Model extends Pi.Model.Abstract {

        instances() {

        }

        init() {
            super.init(Pi.Url.create(App.getConfig('netune.api'), '/user'));
        }

        validators(add) {
            add({
                //'': new Pi.Validator.Require('')
            });
        }

        initWithJson(json) {
            super.initWithJson(json);

            this.workspace = new Workspace.Model({
                id: this.workspaceId || 1
            });

            return this;
        }

        static current() {
            var promise = new Pi.Promise();
            var uuid = Pi.Localdb.get('user-uuid');

            if (uuid == null) {
                Model.createUser(promise);
            } else {
                Model.fetchUser(uuid, promise);
            }

            return promise;
        }

        static createUser(promise) {
            const uuid = Pi.Util.UUID();
            var model = new User.Model();

            model.uuid = uuid;
            model.nome = '';
            model.avatar = '/images/avatar/01.png';
            Pi.Localdb.set('user-uuid', uuid);

            model.insert().ok(promise.resolve, promise);
        }

        static fetchUser(uuid, promise) {
            var model = new User.Model();

            return model.get(uuid).ok(promise.resolve, promise).error(() => {
                Model.createUser(promise);
            });
        }

        loadWorkspace() {
            return this.workspace.get(this.workspaceId).ok((w) => {
                this.workspace = w;
            })
        }

        changeWorkspace(wid) {
            this.workspaceId = wid;

            this.workspace = new Workspace.Model({
                id: wid
            });

            return this._changeWorkspace(wid);
        }

        actions(add) {
            super.actions(add)

            add({
                _changeWorkspace: 'POST:/changeWorkspace'
            });
        }

    };

    Pi.Export('User.Model', Model);
});