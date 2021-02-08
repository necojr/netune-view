yum.define([
    
], function () {

    class Model extends Pi.Model.Abstract{

        instances() {

        }

        init() {
            super.init(Pi.Url.create(App.getConfig('netune.api'), '/musica'));
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

        actions(add) {
            super.actions(add)
            
            add({
                update: 'POST:/update?userid=:uuid',
                get: 'GET:/get?id=:id',
                all: 'GET:/all'
            });
        }

    };

    Pi.Export('Music.Model', Model);
});