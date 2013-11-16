// Global state for the application

define([], function () {
  return {
    simpleNote: {
      get token() { return localStorage['SimpleNoteToken']; },
      set token(v) { localStorage['SimpleNoteToken'] = v; },

      get email() { return localStorage['SimpleNoteEmail']; },
      set email(v) { localStorage['SimpleNoteEmail'] = v; },
    }
  };
});
