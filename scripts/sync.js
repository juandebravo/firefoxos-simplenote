
define(['simplenote', 'when'], function(SimpleNote, when){

  function syncNotes(db, token, email) {
    var defer = when.defer();

    db.notes.clear()
    .done(function() {

      SimpleNote.getNotes(token, email)
      .done(function (notes) {
        notes = notes.filter(function(note) {
          return !note.deleted;
        });

        var retrieve = [ SimpleNote.getNote(token, email, note.key) for each (note in notes) ];
        when.all(retrieve)
        .done(function (notes){
          var store = [];
          notes.forEach(function (note) {
            var prom = db.notes.add({
              key: note.key,
              createdate: note.createdate,
              modifydate: note.modifydate,
              content: note.content,
              version: note.version,
              deleted: note.deleted,
              tags: note.tags,
              systemtags: note.systemtags
            });
            store.push(prom);
          });

          when.all(store)
          .done(defer.resolve);
        });
      });
    });

    return defer.promise;
  }

  function fetchNotes(db) {
    return db.notes.query('modifydate').all().desc().execute();
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