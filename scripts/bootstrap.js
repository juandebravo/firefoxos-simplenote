// Bootstrapping file. Prepares the runtime environment for our cool app :)

require.config({
  // Enable firefox specific features
  scriptType: 'text/javascript;version=1.7',

  baseUrl: 'scripts/',
  paths: {
    zeptojs: '../bower_components/zepto/zepto.min',
    underscore: '../bower_components/underscore/underscore-min',
    Base64: '../bower_components/js-base64/base64.min',
    markdown: '../bower_components/markdown/lib/markdown',
    db: '../bower_components/db/index',
    when: '../bower_components/when/when'
  },
  // Specific symbol aliasing for *browser* modules
  shim: {
    'zeptojs': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'Base64': {
      exports: 'Base64'
    },
    'markdown': {
      exports: 'markdown'
    }
  }
});


require(['zeptojs', 'global', 'db'], function ($, global, db) {
  // Let's use our custom XHR factory to allow cross-domain requests
  $.ajaxSettings.xhr = function() {
    return new XMLHttpRequest({mozSystem: true});
  };

  // Dirty debugging trick, reload on double click
  var lastClick = 0;
  $(document.body).on('click', function(){
    var ts = new Date().getTime();
    if (ts - lastClick < 300) {
      document.location.reload(true);
    }
    lastClick = ts;
  });

  db.open({
    server: 'SimpleNote',
    // IMPORTANT: Increase this number if the schema below changes!
    version: 2,
    schema: {
      notes: {
        key: {keyPath: 'key' , autoIncrement: false },
        indexes: {
          modifydate: { }
        }
      }
    }
  }).done(function(s) {
      global.db = s;
  });

  // The application is now fully bootstrapped!
  require(['main']);
});
