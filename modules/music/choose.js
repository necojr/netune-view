yum.define([

], function (html) {

    class Control extends Pi.Component {

        instances() {
            this.view = new Pi.View(`<div class="sheet-modal" style="height: auto">
                <div class="sheet-modal-inner">
                    <div class="swipe-handler"></div>
                    <div class="page-content">
                        <div class="block">
                            <div class="block-title block-title-medium margin-top">Repertório</div>
                            <div class="list media-list no-hairlines"><ul at="_list"></ul></div>
                        </div>
                    </div>
                </div>
            </div>`);

            this._list = new Pi.ElementList({
                template: `<li>
                    <a href="javascript:void(0)" class="item-link item-content"  data-event-click="@{id}">
                        <div class="item-inner">
                            <div class="item-title-row">
                                <div class="item-title">@{nome}</div>
                                <div class="item-after" style="color: #6200ee;">
                                    <i class="fas fa-plus"></i>
                                </div>
                            </div>
                            <div class="item-subtitle">@{versao}</div>
                        </div>
                    </a>
                </li>`
            });
        }

        viewDidLoad() {
            this.createSheetModal();
            this.loadMusics();

            super.viewDidLoad();
        }

        createSheetModal(){
            this._sheet = app.f7.sheet.create({
                el: '#' + this.view.id,
                // swipeToClose: true,
                // swipeToStep: true,
                // backdrop: true
            });
        }

        loadMusics(){
            this._list.load([
                { id: 1, nome: 'Quebrantado', versao: 'Vineard' },
                { id: 2, nome: 'Quebrantado', versao: 'Vineard' },
                { id: 10, nome: 'Quebrantado', versao: 'Vineard' },
                { id: 4, nome: 'Quebrantado', versao: 'Vineard' },
                { id: 5, nome: 'Ruge Cruz', versao: 'Aline Barros' },
                { id: 6, nome: 'Ruge Cruz', versao: 'Aline Barros' },
                { id: 7, nome: 'Ruge Cruz', versao: 'Aline Barros' },
                { id: 8, nome: 'Ruge Cruz', versao: 'Aline Barros' },
                { id: 9, nome: 'Ruge Cruz', versao: 'Aline Barros' },
                { id: 11, nome: 'Ruge Cruz', versao: 'Aline Barros' },
              {
                id: 3, nome: 'Emaus', versao: 'Morada', letraCifrada: 
`titulo
Mais Perto

youtube
https://www.youtube.com/embed/xDKuw1s8dSQ

tom
C

intro
C   F   G

estrofe
C    C/E    F     Dm
Mais perto quero estar
C    Am     G
Meu Deus de Ti

coro
C      C4     C
sempre ei de suplicar
C    Am    G4    G/B
mais perto quero estar
C    G/A#  F      Dm
mais perto quero estar
C   G       F   C/E   Dm  C
meu Deus de Ti
A/C#
mais perto quero estar
A/C#
mais perto quero estar



ponte
C
por amor
    F 
sua vida entregou
    G 
meu Senhor
    A
humilhado foi
    E
como a flor machucada
C
no jardim`},
            ]);
        }

        open(){
            this._sheet.open();

            return this;
        }

        close() {
            this._sheet.close();

            return this;
        }

        destroy() {
            this._sheet.destroy();
            
            super.destroy();
        }

        events(listen){
            super.events(listen);
        
            listen({
                '{_list} click': function(_, music){
                    this.event.trigger('choose', music);
                }
            });
        }

    };

    Pi.Export('Music.Choose', Control);
});