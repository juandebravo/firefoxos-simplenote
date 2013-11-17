namespace simplenoteapp.api

from BooJs.Async import defer
from requirejs import zeptojs, Base64

const HOST = 'https://simple-note.appspot.com'
const PATH_LOGIN = 'api/login'
const PATH_NOTES = 'api2/index'
const PATH_NOTE = 'api2/data'


def auth(email, password):
	d = defer()
	zeptojs.ajax(
		type: 'POST',
		url: HOST + PATH_LOGIN,
		data: Base64.encode("email=$email&password=$password"),
		success: defer.resolve,
		error: { xhr, type | defer.reject(type) }
	)
	return d.promise

def getNotes(token, email):
	d = defer()
	results = []

	def getRecursiveNotes(mark):
		zeptojs.getJSON(HOST + PATH_NOTES,
			auth: token,
			email: email,
			length: '100',
			mark: mark or ''
		) do (data):
			results = results.concat(data.data)
			# Keep asking for pages if there is a mark
			if (data.mark)
				return getRecursiveNotes(data.mark)
			d.resolve(results)

	getRecursiveNotes()
	return d.promise

def getNote(token, email, key):
	d = defer()
	zeptojs.getJSON(HOST + PATH_NOTE + key,
		auth: token
		email: email
	):
		defer.resolve()
	
	return defer.promise
