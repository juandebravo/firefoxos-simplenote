// Bootstrapping file. Prepares the runtime environment for our cool app :)

require.config({
  // Enable firefox specific features
  scriptType: 'text/javascript;version=1.7',

  baseUrl: 'scripts/',
  paths: {
    zeptojs: '../bower_components/zepto/zepto.min',
    underscore: '../bower_components/underscore/underscore-min',
    Base64: '../bower_components/js-base64/base64.min',
    markdown: '../bower_components/markdown/lib/markdown'
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


require(['zeptojs'], function ($) {
  // Let's use our custom XHR factory to allow cross-domain requests
  $.ajaxSettings.xhr = function() {
    return new XMLHttpRequest({mozSystem: true});
  };

  // Dirty debugging trick, reload on double click
  var lastClick = 0;
  $(document.body).on('click', function(){
    var ts = new Date().getTime();
    if (ts - lastClick < 300) {
      console.log('double click');
      document.location.reload(true);
    }
    lastClick = ts;
  });

  // The application is now fully bootstrapped!
  require(['main']);
});
