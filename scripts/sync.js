
define(['simplenote', 'when'], function(SimpleNote, when){

  function syncNotes(db, token, email) {
    var defer = when.defer();

    db.notes.clear()
    .done(function() {

      SimpleNote.getNotes(token, email)
      .done(function (notes) {
        var arr = notes.filter(function(note) {
          return !note.deleted;
        });
        var numNotes = arr.length;
        if(numNotes === 0){
          callback();
        }
        arr.forEach(function(note){
          SimpleNote.getNote(token, email, note.key)
          .done(function (note) {
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
                  defer.resolve();
                }
            });
          });
        });
      });
    });

    return defer.promise;
  }

  function fetchNotes(db) {
    return db.notes.query().all().execute();
  }

  function fetchNote(db, key) {
    var defer = when.defer();
    db.notes.query().filter('key', key)
    .execute()
    .done(function(result) {
      defer.resolve(result[0]);
    });
    return defer.promise;
  }

  return {
    syncNotes: syncNotes,
    fetchNotes: fetchNotes,
    fetchNote: fetchNote
  };

});