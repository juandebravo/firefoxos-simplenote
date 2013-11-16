
define(['simplenote'], function(SimpleNote){

  function syncNotes(db, token, email, callback) {
    db.notes.clear()
    .done(function() {
      SimpleNote.getNotes(token, email, function(notes){
        var numNotes = notes.length;
        if(numNotes === 0){
          callback();
        }
        notes.forEach(function(note){
          SimpleNote.getNote(token, email, note.key, function(note){
            db.notes.add({
              key: note.key,
              createdate: note.createdate,
              modifydate: note.modifydate,
              content: note.content,
              version: note.version,
              deleted: note.deleted,
              tags: note.tags,
              systemtags: note.systemtags
            }).done(function(item) {
                numNotes--;
                if(numNotes === 0) {
                  callback();
                }
            });
          });
        });
      });
    });
  }

  function fetchNotes(db, callback) {
    db.notes.query().all()
    .execute()
    .done(function(results) {
      callback(results);
    });
  }

  function fetchNote(db, key, callback) {
    db.notes.query().filter('key', key)
    .execute()
    .done(function(result) {
      callback(result[0]);
    });
  }

  return {
    syncNotes: syncNotes,
    fetchNotes: fetchNotes,
    fetchNote: fetchNote
  };

});