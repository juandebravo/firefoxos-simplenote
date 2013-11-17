namespace simplenoteapp

from requirejs import zeptojs as Z
from requirejs import markdown
from simplenoteapp import api
from simplenoteapp import sync


const ul = Z('#notes-view ul')
const views = ['#main-view', '#note-view', '#login-view', '#settings-view']


def showView(view):
	for v in views:
		Z(v).hide()
	Z(view).show()

[async]
def printNotes():
	ul.empty()
	await notes = sync.fetchNotes(global.db)
	for note in notes:
		lines = note.content.split('\n')
		lines = [ln for ln in lines if line != '']
		ul.append(
			"<li><a href='#' data-key='$(data.key)'><p>
				$(info[0])
			</p><p>
				$(info[1])
			</p></a></li>")


ul.on('click', 'a') do (e):
	await data = sync.fetchNote(global.db, self.getAttribute('data-key'))
	content = data.content
	if 'markdown' in data.systemtags:
		content = markdown.toHTML(content)

	Z('#note-content').html(content)
	showView('#note-view')

Z('#login-button').click do (e):
	e.stopPropagation()
	e.preventDefault()
	global.simpleNote.email = Z('#email').val()
	password = Z('#password').val()
	try:
		await token = api.auth(global.simpleNote.email, password)
		global.simpleNote.token = token
		showView('#main-view')
		await sync.syncNotes(global.db, global.simpleNote.token, global.simpleNote.email)
		printNotes()
	except:
		alert('Error authenticating, please try again')

Z('.button-back').click do (e):
	e.stopPropagation()
	e.preventDefault()
	showView('#main-view')

Z('#settings-open').click do (e):
	showView('#settings-view')

Z('.logout').click do (e):
	await global.db.notes.clear()
	global.simpleNote.token = ''
	global.simpleNote.email = ''
	showView('#login-view')


if not global.simpleNote.token:
	console.debug('No token found in localStorage, authenticating...')
	showView('#login-view')
else:
	sync.syncNotes(
		global.db, 
		global.simpleNote.token, 
		global.simpleNote.email
	).done(printNotes)
