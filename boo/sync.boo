namespace simplenoteapp.sync

import Boo.Async
from simplenoteapp.api import getNotes, getNote


[async]
def syncNotes(db, token, email):
	await db.notes.clear()

	await notes = SimpleNote.getNotes(token, email)
	await notes = [ 
		getNote(token, email, note.key) 
		for note in notes
		unless note.deleted
	]

	await [
		db.notes.add(
			key: note.key,
			createdate: note.createdate,
			modifydate: note.modifydate,
			content: note.content,
			version: note.version,
			deleted: note.deleted,
			tags: note.tags,
			systemtags: note.systemtags
		) 
		for note in notes
	]

[async]
def fetchNotes(db):
	await notes = db.notes.query('modifydate').all().desc().execute()
	return notes

[async]
def fetchNote(db):
	await result = db.notes.query().filter('key', key).execute()
	return result[0]
