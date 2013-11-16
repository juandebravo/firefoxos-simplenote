require([
  'global',
  'zeptojs',
  'markdown',
  'simplenote',
  'sync'
], function (global, $, markdown, SimpleNote, sync) {
  'use strict';

  var ul = $('#notes-view ul');

  var views = ['#main-view', '#note-view', '#login-view', '#settings-view'];

  function showView(view) {
    views.forEach(function(v){
      $(v).hide();
    });
    $(view).show();
  }

  ul.on('click', 'a', function(e) {
    sync.fetchNote(global.db,
      this.getAttribute('data-key'),
      function(data) {
        var content = data.content;
        if(data.systemtags.indexOf('markdown') != -1) {
          content = markdown.toHTML(data.content);
        }
        $("#note-content").html(content);
        showView("#note-view");
      });
  });

  function printNotes() {
    ul.empty();
    sync.fetchNotes(global.db, function(notes){
      notes.forEach(function(data) {
        var info = data.content.split('\n');
        info = [i for each (i in info) if (i.length > 0)];
        ul.append('<li><a href="#" data-key="'+data.key+'"><p>'+info[0]+'</p><p>'+info[1]+'</p></a></li>');
      });
    });
  }

  if (!global.simpleNote.token) {
    console.debug('No token found in localStorage, authenticating...');
    showView("#login-view");
  } else {
    sync.syncNotes(global.db, global.simpleNote.token, global.simpleNote.email, printNotes);
  }

  $('#login-button').click(function(e) {
    e.stopPropagation();
    e.preventDefault();
    global.simpleNote.email = $('#email').val();
    var password = $('#password').val();
    SimpleNote.auth(global.simpleNote.email, password, function(data){
      console.debug('Token: %s', data);
      global.simpleNote.token = data;
      showView("#main-view");
      sync.syncNotes(global.db, global.simpleNote.token, global.simpleNote.email, printNotes);
    });
  });

  $(".button-back").click(function(e) {
    e.stopPropagation();
    e.preventDefault();
    showView("#main-view");
  });

  $("#settings-open").click(function(e) {
    showView("#settings-view");
  });

  $(".logout").click(function(e) {
    e.stopPropagation();
    e.preventDefault();
    global.db.notes.clear().done(function() {
      global.simpleNote.token = '';
      global.simpleNote.email = '';
      showView("#login-view");
    });
  });

});
