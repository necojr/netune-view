yum.define([
    Pi.Url.create('Vendor', '/codemirror/music.css')
], function () {

    class Mode extends Pi.Class {

        instances() {
            this.name = 'music';
            this.lookup = {};
        }

        init(){
            this.createCodeMirror();
        }

        addLookup(key, value){
            this.lookup[key] = value;
        }

        existLookup(key){
            return this.lookup[key] != undefined;
        }

        getLookup(key){
            return this.lookup[key];
        }

        createCodeMirror() {
            var self = this;

            CodeMirror.defineMode('music', function () {
                return {
                    startState: function (basecolumn) {
                        return {};
                    },

                    token: function (stream) {
                        var rowContent = stream.string.toLowerCase();
                        stream.pos = rowContent.length + 1;

                        if (self.existLookup(rowContent)) {
                            return self.getLookup(rowContent);
                        }

                        return '';
                    }
                }
            });
        }

    };

    Pi.Export('CodeMirrorModeMusic', Mode);
    Pi.Export('CodeMirrorModeMusicType', {
        TITLE: 'title',
        NOTES: 'notes',
    });
});