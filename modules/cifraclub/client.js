yum.define([

], function () {

    class Musica extends Pi.Class {
        get nome() {
            return this.m;
        }

        get grupo() {
            return this.a;
        }

        get url() {
            return `https://www.cifraclub.com.br/${this.d}/${this.u}`;
        }

        get preview() {
            return `https://studiosol-a.akamaihd.net/letras/25x25/fotos/${this.i}`;
        }
    }

    class Model extends Pi.Model.Abstract {

        instances() {

        }

        init() {
            super.init(Pi.Url.create(App.getConfig('netune.api'), '/cifraclub'));
        }

        validators(add) {
            add({
                //'': new Pi.Validator.Require('')
            });
        }

        initWithJson(payload) {
            // super.initWithJson(json);

            if (payload.docs) {
                this.musicas = [];
                for (let i = 0; i < payload.docs.length; i++) {
                    var m = new Musica();
                    m.inject(payload.docs[i])
                    this.musicas.push(m);
                }
            } else {
                this.lyrics = payload;
            }

            return this;
        }

        actions(add) {
            super.actions(add)

            add({
                'search': 'GET:/search?query=:q'
            });
        }

    };

    Pi.Export('CifraClub.Client', Model);
});