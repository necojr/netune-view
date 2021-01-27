yum.define([
    Pi.Url.create('Vendor', '/codemirror/codemirror.css'),
    Pi.Url.create('Vendor', '/codemirror/codemirror.js'),
], function (html) {

    class Control extends Pi.Component {

        instances() {
            this.view = new Pi.View('<div><textarea id="textarea"></textarea></div>');
        }

        viewDidLoad() {
            this.createEditor();

            super.viewDidLoad();
        }

        createEditor(){
            this._mirror = CodeMirror.fromTextArea(this.view.get('textarea'), {
                lineNumbers: true,
                mode: this.mode.name
            });
        }

        markLineError(line) {
            this._mirror.markText({ line: line - 2 }, { line: line - 1 }, { className: 'cm-error' });

            return this;
        }

        set(value){
            this._mirror.setValue(value);

            return this;
        }

        get() {
            return this._mirror.getValue();
        }

    };

    Pi.Export('CodeMirrorEditor', Control);
});