define(['zeptojs',
'base64'], function($, Base64) {

  var HOST = 'https://simple-note.appspot.com/',
      pathLogin = 'api/login',
      pathNotes = 'api2/index',
      pathNote  = 'api2/data/';

  function auth(email, password, callback) {
    $.post(HOST + pathLogin,
           Base64.encode('email='+email+'&password='+password),
           callback);
  }

  function getNotes(token, email, callback) {
    var results = [];
    function getRecursiveNotes(mark) {
      $.getJSON(HOST + pathNotes, {
          auth: token,
          email: email,
          length: '100',
          mark: mark || ''},
        function(data) {
          results = results.concat(data.data);
          if (data.mark) {
            getRecursiveNotes(data.mark);
          } else {
            callback(results);
          }
        }
      );
    }
    getRecursiveNotes();
  }

  function getNote(token, email, key, callback) {
    $.getJSON(HOST + pathNote + key, {
        auth: token,
        email: email},
      callback);
  }

  return {
    auth: auth,
    getNotes: getNotes,
    getNote: getNote
  };

});