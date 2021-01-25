yum.define([

], function () {

    Pi.Export('Omni.ClientStatus', {
        OPENED: 0,
        CONNECTED: 1,
    });
        
    class Client extends Pi.Class {

        instances() {
            super.instances();

            this.event = new Pi.Event();
            this._cn = null;
            this.url = '';

            this.status = Omni.ClientStatus.OPENED;
        }

        enter(group){
            this.send({
                type: 'omni.listen',
                group: group
            });
        }

        connect() {
            if (this.status == Omni.ClientStatus.CONNECTED) return;

            this._cn = new WebSocket(App.getConfig('omni.url') || this.url);
            this.listen();
        }

        listen() {
            this._cn.onmessage = (e) => {
                var payload = JSON.parse(e.data);

                if (payload.type == 'ommi.connected') {
                    this.status = Omni.ClientStatus.CONNECTED;
                    this.event.trigger('connected');
                    return;
                }

                if (payload.type == 'omni.event') {
                    this.event.trigger(payload.event, payload.data);
                    return;
                }

            }
        }

        trigger(event, group, message = {}){
            this.send({
                type: 'omni.trigger',
                event: event,
                group: group,
                data: message
            });
        }

        send(message) {
            this._cn.send(JSON.stringify(message));
        }
    };

    Pi.Export('Omni.Client', Client);
});