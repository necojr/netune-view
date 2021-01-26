yum.define([
    
], function () {

    class Model extends Pi.Model.Abstract{

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

            return this;
        }

        static current() {
            var promise = new Pi.Promise();
            var model = new User.Model();
            var uuid = Pi.Localdb.get('user-uuid');

            if (uuid == null) {
                uuid = Pi.Util.UUID();
                model.nome = '';
                model.avatar = '/images/avatar/001-man.png';
                model.uuid = uuid;
                Pi.Localdb.set('user-uuid', uuid);
                model.insert().ok(promise.resolve, promise);
            } else {
                model.get(uuid).ok(promise.resolve, promise);
            }

            return promise;
        }

        actions(add) {
            super.actions(add)
            
            add({
                
            });
        }

    };

    Pi.Export('User.Model', Model);
});