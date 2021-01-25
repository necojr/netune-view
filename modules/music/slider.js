yum.define([
    
], function (html) {

    class Control extends Pi.Component {

        instances() {
            this.view = new Pi.View(`<div class="swiper-container">
                <div class="swiper-pagination swiper-pagination-bullets" style="bottom: 0px;"></div>
                <!-- Slides wrapper -->
                <div class="swiper-wrapper" id="slides"></div>
            </div>`
            );
        }

        load(lyrics, lineHeight = 22) {
            if (this._swiper) {
                this.view.get('slides').html('');
                this._swiper.destroy();
            }

            var pageHeight = this.view.element.parent().query().height() + 2;
            var maxlines = pageHeight / lineHeight;

            var rows = this.createRows(lyrics);
            var pages = this.createPages(rows, maxlines);

            for (let i = 0; i < pages.length; i++) {
                this.createSlide(pages[i].join(''));
            }

            this.createSwiper();
        }

        createPages(rows, maxlines) {
            var pages = [];
            var pageNumber = 0;

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                if (pages[pageNumber] == undefined) {
                    pages[pageNumber] = [];
                }

                if (pages[pageNumber].length >= maxlines - 1) {
                    pages[pageNumber + 1] = [];

                    if (!row.isBreakable) {
                        for (var j = i - 1; j >= 0; j--) {
                            if (!rows[j].isMoveable) continue;
                            if (rows[j].isBreakable) {
                                for (let w = j; w < pages[pageNumber].length;) {
                                    pages[pageNumber + 1].push(pages[pageNumber][w]);
                                    pages[pageNumber].splice(w, 1);
                                }
                                break;
                            }
                        }
                    }

                    pageNumber++;
                }

                pages[pageNumber].push(row.content);
            }


            return pages;
        }

        createRows(lyrics){
            var rows = [];

            for (let i = 0; i < lyrics.tokens.length; i++) {
                const token = lyrics.tokens[i];

                if (token.isTitle) {
                    rows.push({
                        isMoveable: false,
                        isBreakable: false,
                        content: '\n'
                    });

                    rows.push({
                        isMoveable: true,
                        isBreakable: true,
                        content: `\n<span style="padding: 0 20px; background-color: #ffff00;color: #333; font-weight: bold;">${token.key}</span>`
                    });

                    if (token.value.length > 0) {
                        rows.push({
                            isMoveable: true,
                            isBreakable: false,
                            content: `\n<span style="color: #ff0000; font-weight: bold;">${token.value}</span>`
                        });
                    }
                } else {
                    rows.push({
                        isMoveable: true,
                        isBreakable: token.isBreakable,
                        content: `\n<span style="color: #ff0000; font-weight: bold;">${token.key}</span>`
                    });

                    if (token.tag == 'CORO') {
                        rows.push({
                            isMoveable: true,
                            isBreakable: false,
                            content: `\n<span style="color: #19b861">${token.value}</span>`
                        });
                    } else {
                        rows.push({
                            isMoveable: true,
                            isBreakable: false,
                            content: `\n<span style="">${token.value}</span>`
                        });
                    }
                }
            }

            return rows;
        }

        createSlide(text){
            this.view.get('slides').append(`<div class="swiper-slide" style="background: #fff"><pre>${text}</pre></div>`);
        }

        createSwiper(){
            this._swiper = app.f7.swiper.create('#' + this.view.id, {
                // effect: 'cube',
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets',
                },
                // direction: 'vertical',
                // pagination: '.swiper-pagination'
            });
        }

        destroy() {
            this._swiper.destroy();

            super.destroy();
        }
    };

    Pi.Export('Music.Slider', Control);
});