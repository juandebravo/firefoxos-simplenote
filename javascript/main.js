require.config({
  baseUrl: '/javascript/',
  paths: {
    zeptojs: '../bower_components/zepto/zepto.min',
    underscore: '../bower_components/underscore/underscore-min',
    base64: '../bower_components/js-base64/base64.min',
    markdown: '../bower_components/markdown/lib/markdown'
  },
  shim: {
    'zeptojs': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'base64': {
      exports: 'Base64'
    },
    'markdown': {
      exports: 'markdown'
    }
  }
});

require([
  'zeptojs',
  'global',
  'simplenote',
  'markdown'
], function ($, global, SimpleNote, Markdown) {
  'use strict';

  var ul = $('#notes-view ul');

  ul.on('click', 'a', function(e) {
    SimpleNote.getNote(global.simpleNote.token,
      global.simpleNote.email,
      this.getAttribute('data-key'),
      function(data) {
        var content = Markdown.toHTML(data.content);
        $("#notes-view").html(content);
        $("#notes-view", "#note-view").toggle();
      });
  });

  function printNotes(notes) {
    notes.sort(function(a, b){
      return a.modifydate < b.modifydate;
    });
    ul.empty();
    notes.forEach(function(note) {
      SimpleNote.getNote(global.simpleNote.token, global.simpleNote.email, note.key, function(data){
        var info = data.content.split('\n');
        info = [i for each (i in info) if (i.length > 0)];
        ul.append('<li><a href="#" data-key="'+note.key+'"><p>'+info[0]+'</p><p>'+info[1]+'</p></a></li>');
      });

    });
  }

  $.ajaxSettings.xhr = function() {
    return new XMLHttpRequest({mozSystem: true});
  };

  var token = localStorage.getItem('simplenote.token');
  if (token === null) {
    SimpleNote.auth(global.simpleNote.email, global.simpleNote.password, function(data){
      localStorage.setItem('simplenote.token', data);
      global.simpleNote.token = data;
      SimpleNote.getNotes(token, global.simpleNote.email, printNotes);
    });
  } else {
    global.simpleNote.token = token;
    SimpleNote.getNotes(token, global.simpleNote.email, printNotes);
  }


  $('#login').click(function() {
    // login flow
  });

});
