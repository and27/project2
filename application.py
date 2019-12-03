import os

from collections import deque 

from flask import Flask, render_template, request, redirect, session
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from wrapd import loginRequired

app = Flask(__name__)
app.config["SECRET_KEY"]="secretkey"
socketio = SocketIO(app)

#Keep track of created channels
channelsCreated = []

#Keep track of logged users
usersLogged = []

#A dictionaty to store all channels messages
channelsMessages = dict()


@app.route("/")
@loginRequired
def index():
        return render_template("index.html", channels=channelsCreated)

@app.route("/signin", methods=['POST','GET'])
def signin():
	#Forget any username
	session.clear()

	username = request.form.get("username")
	if request.method == "POST":
		if len(username)<1 or username is '':
			return render_template("error.html", message="username can not be empty")
		if username in usersLogged:
			return render_template("error.html", message="user already exist")
		
		usersLogged.append(username)
		session['username'] = username
		#Remember the user session on a cookie to be remembered if the browser is closed
		session.permanent = True
		return redirect("/")
	else:
		return render_template("signin.html")

	
@app.route("/logout", methods=['GET'])
def logout():
        try:
                usersLogged.remove(session['username'])
        except ValueError:
                pass

        session.clear()
        return redirect("/")

@app.route("/create", methods=['GET','POST'])
def create():
	newChannel = request.form.get("channel")

	if request.method == "POST":
		if newChannel in channelsCreated:
			return render_template("error.html", message="The channel already exists!")
		channelsCreated.append(newChannel)

		channelsMessages[newChannel] = deque()
		return redirect("/channels/"+newChannel)
	else:
		return render_template("create.html",channels=channelsCreated)

@app.route("/channels/<channel>", methods=['GET','POST'])
@loginRequired
def enterChannel(channel):
        session['current_channel']=channel
        if request.method == "POST":
                return redirect("/")
        else:
                return render_template("channel.html", channels=channelsCreated, messages=channelsMessages[channel])

@socketio.on("joined", namespace='/')
def joined():
	room = session.get('current_channel')
	joinRoom(room)
	
	emit('status',{
		'user Joined' : session.get('username'),
		'channel':room,
		'msg':session.get('username')+'has entered the channel'
		}, room=room)
		
@socketio.on("left", namespace='/')
def left():
	room = session.get('current_channel')
	leave_room(room)
	emit('status',{
	'msg':session.get('username')+'has left the channel'},room=room)


@socketio.on('send message')
def send_msg(msg, timestamp):
	room = session.get('current_channel')
	if len(channelsMessages[room])>100:
		channelsMessages.popleft()

	channelsMessages[room].append([timestamp, session.get('username'), msg])
	emit('announce message',{
		'user': session.get('username'),
		'timestamp': timestamp,
		'msg':msg}, room=room)
		



