require([
  'global',
  'zeptojs',
  'markdown',
  'simplenote',
  'global'
], function (global, $, markdown, SimpleNote) {
  'use strict';

  var ul = $('#notes-view ul');

  ul.on('click', 'a', function(e) {
    SimpleNote.getNote(global.simpleNote.token,
      global.simpleNote.email,
      this.getAttribute('data-key'),
      function(data) {
        var content = markdown.toHTML(data.content);
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

  if (!global.simpleNote.token) {
    console.debug('No token found in localStorage, authenticating...');
    $(["#notes-view", "#login-view"]).toggle();
  } else {
    SimpleNote.getNotes(global.simpleNote.token, global.simpleNote.email, printNotes);
  }

  $('#login-button').click(function() {
    global.simpleNote.email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    SimpleNote.auth(global.simpleNote.email, password, function(data){
      console.debug('Token: %s', data);
      global.simpleNote.token = data;
      SimpleNote.getNotes(global.simpleNote.token, global.simpleNote.email, printNotes);
    });

  });

});
