/**
 * Configuration Globais
 */
Pi.App.config({

    yum: {
        cache: false,
        sync: false
    },

    model: {
        cacheResponse: true
    },

    modules: {
        /**
          System Configuration
         */
        'Netune-Api': { base: '' },
        'Public': { base: 'localhost', url: '' },
        'Modules': { base: 'Public', url: '/modules' },
        'Vendor': { base: 'Public', url: '/vendor' },
        'UI': { base: 'Modules', url: '/ui' },

        /**
          App Configuration
         */
        'Music': {base: 'Modules', url: '/music'},
        'Lexicon': { base: 'Modules', url: '/lexicon' },
        'Workspace': { base: 'Modules', url: '/workspace' },
        'Omni': { base: 'Vendor', url: '/omni' },
    },

    netune: {
        api: 'https://api.ministerioatos239.com.br'
    },

    omni: {
        url: 'wss://omni.ministerioatos239.com.br:775'
    },

    services: ['Music']
});