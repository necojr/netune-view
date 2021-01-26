yum.define([
    Pi.Url.create('Music', '/model.js')
], function () {

    class Model extends Pi.Model.Abstract{

        instances() {

        }

        init() {
            super.init(Pi.Url.create(App.getConfig('netune.api'), '/workspace'));
        }

        validators(add) {
            add({
                //'': new Pi.Validator.Require('')
            });
        }

        initWithJson(json) {
            super.initWithJson(json);

            this.musicas = json.musicas || [];
            for (let i = 0; i < this.musicas.length; i++) {
                this.musicas[i] = Music.Model.create().initWithJson(this.musicas[i]);
            }

            if (this.user) {
                this.user = User.Model.create().initWithJson(this.user);
            }

            return this;
        }

        actions(add) {
            super.actions(add)
            
            add({
                'current': 'GET:/current',
                'save': 'POST:/save',
                'select': 'POST:/select?id=:id',
            });
        }

    };

    Pi.Export('Workspace.Model', Model);
});