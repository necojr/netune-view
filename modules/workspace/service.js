yum.define([
    Pi.Url.create('Workspace', '/model.js')
], function (html) {

    class Service extends Pi.Service {

        routes() {
            return {
                '/playlist/:id'(id) {
                    app.loading(true);
                    app.user.changeWorkspace(id).ok(() => {
                        app.loadWorkspace();
                    }).error((message) => {
                        app.notification('Atenção!', message);
                    }).done(() => {
                        app.loading(false);
                    });
                }
            };
        }

    };

    Pi.Export('Service.Workspace', Service);
});