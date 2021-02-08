yum.define([

], function () {

    class Converter extends Pi.Class {

        instances() {
            super.instances();
        }

        static parse(text) {
            text = text.replace(/\r/gi, '');
            const rows = text.split('\n');
            var newlines = [];

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row.toUpperCase().indexOf('[INTRO]') > -1) {
                    newlines.push('INTRO');
                    newlines.push(row.toUpperCase().replace('[INTRO]', '').trim());
                } else if (row.toUpperCase() == '[REFRÃO]') {
                    newlines.push('CORO');
                } else if (row.indexOf('[') > -1 && row.indexOf(']') > -1) {
                    newlines.push('PARTE');
                } else if (row.length > 0) {
                    newlines.push(row);
                }
            }

            return newlines.join('\n');
        }
    };

    Pi.Export('CifraClub.Converter', Converter);
});