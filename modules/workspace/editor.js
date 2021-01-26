yum.define([
    
], function(html){

    class Control extends Pi.Component{

        instances(){
            this.view = new Pi.View(html);
        }

    };

    Pi.Export('Workspace.Editor', Control);
});