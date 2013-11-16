define(['zeptojs', 'Base64', 'when'], function
      ($, Base64, when) {

  // System tags: pinned, markdown

  var HOST = 'https://simple-note.appspot.com/',
      pathLogin = 'api/login',
      pathNotes = 'api2/index',
      pathNote  = 'api2/data/';

  function auth(email, password, callback) {
    $.post(HOST + pathLogin,
           Base64.encode('email=' + email + '&password=' + password),
           callback);
  }

  function getNotes(token, email) {
    var defer = when.defer();
    var results = [];

    function getRecursiveNotes(mark) {
      $.getJSON(HOST + pathNotes, {
          auth: token,
          email: email,
          length: '100',
          mark: mark || ''},
        function(data) {
          results = results.concat(data.data);
          // Keep asking for pages if there is a *mark*
          if (data.mark) {
            return getRecursiveNotes(data.mark);
          }

          defer.resolve(results);
        }
      );
    }

    // Initiate the requests for notes indices
    getRecursiveNotes();

    return defer.promise;
  }

  function getNote(token, email, key) {
    var defer = when.defer();
    $.getJSON(HOST + pathNote + key, {
        auth: token,
        email: email},
      defer.resolve);
    return defer.promise;
  }

  return {
    auth: auth,
    getNotes: getNotes,
    getNote: getNote
  };

});