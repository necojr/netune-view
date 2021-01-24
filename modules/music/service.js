yum.define([
    Pi.Url.create('Music', '/model.js')
], function (html) {

    class Service extends Pi.Service {

        routes() {
            return {
                '/musica/:id'(id) {
                    var model = new Music.Model();
                    model.get(id).ok((musica) => {
                        app.addPage(new Music.Page({
                            musica: musica
                        }));
                    });
                }
            };
        }

    };

    Pi.Export('Service.Music', Service);
});