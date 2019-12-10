document.addEventListener('DOMContentLoaded', ()=>{

	
	var socket = io.connect(location.protocol+'//'+document.domain+':'+location.port);

	socket.on('connect',()=>{
		socket.emit('joined');

		document.querySelector('#newChannel').onclick=()=>{
			localStorage.removeItem('last_channel');};

		document.querySelector('#leave').onclick=()=>{
			socket.emit('left');
			localStorage.removeItem('last_channel');
			window.location.replace('/');}

	// When user leaves channel redirect to '/'
        document.querySelector('#leave').addEventListener('click', () => {

            // Notify the server user has left
            socket.emit('left');

            localStorage.removeItem('last_channel');
            window.location.replace('/');
        })
 // Forget user's last channel when logged out
        document.querySelector('#logout').addEventListener('click', () => {
            localStorage.removeItem('last_channel');
        });

        // 'Enter' key on textarea also sends a message
        // https://developer.mozilla.org/en-US/docs/Web/Events/keydown
        document.querySelector('#comment').addEventListener("keydown", event => {
            if (event.key == "Enter") {
                document.getElementById("send-button").click();
            }
        });
        
        // Send button emits a "message sent" event
        document.querySelector('#send-button').addEventListener("click", () => {
	console.log('ok');
            
            // Save time in format HH:MM:SS
            let timestamp = new Date;
            timestamp = timestamp.toLocaleTimeString();

            // Save user input
            let msg = document.getElementById("comment").value;

            socket.emit('send message', msg, timestamp);
            
            // Clear input
            document.getElementById("comment").value = '';
        });




	document.querySelector('#emoji').addEventListener("click", () => {	
		
		 let timestamp = new Date;
           	 timestamp = timestamp.toLocaleTimeString();

		socket.emit('emoji', timestamp);
		console.log("message emit emoji");	
		
    });

document.querySelector('#emoji2').addEventListener("click", () => {	
		
		 let timestamp = new Date;
           	 timestamp = timestamp.toLocaleTimeString();

		socket.emit('emoji2', timestamp);
		console.log("message emit emoji");	
		
    });

	
})    

    // When user joins a channel, add a message and on users connected.
    socket.on('status', data => {

        // Broadcast message of joined user.
        let row = '<' + `${data.msg}` + '>'
        document.querySelector('#chat').value += row + '\n';

        // Save user current channel on localStorage
        localStorage.setItem('last_channel', data.channel)
    })

    // When a message is announced, add it to the textarea.
    socket.on('announce message', data => {

        // Format message
        let row = '<' + `${data.timestamp}` + '> - ' + '[' + `${data.user}` + ']:  ' + `${data.msg}`
        document.querySelector('#chat').value += row + '\n';
    })

socket.on('emoji a',data=>{
		console.log("received");
  		document.querySelector("#modal").style.display="block";

		setTimeout(function () {document.querySelector		("#modal").style.display="none"},2000)


})

socket.on('emoji a2',data=>{
		console.log("received");
  		document.querySelector("#modal2").style.display="block";

		setTimeout(function () {document.querySelector		("#modal2").style.display="none"},2000)


})
});

	




