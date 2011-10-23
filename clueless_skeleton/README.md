Clueless Skeleton
=================

The code here has basic support for the currently defined messages in the Communications Messages.xlsx file located in the Team BAM Shared Dropbox directory. On the server side, the stub message receive functions are located in the clueless_socket_server.js file. A sample bit of a stubbed message function is show here:
  
	socket.on('clientPlayerJoinGame', function(player) {
		putsMessage(['clientPlayerJoinGame', player]);
		io.sockets.emit('bdcstPlayerJoinedGame', player)
	});


This function will be called when a `clientPlayerJoinGame` message is received by the server. It will use the `putsMessage` function to print out the message to the console for logging and debugging purposes. It will then emit a `bdcstPlayerJoinedGame` message to all the clients with the player that joined as data.

To run you need node.js installed. See [http://nodejs.org/](http://nodejs.org/). 
To run this on Mac OS X and Linux `sudo node clueless_server.js`
To run this on Windows `node.exe clueless_server.js`. I think you will have to have admin rights since it launches a server on port 80.

Once the node.js server is running access it via a web browser at http://localhost/

The client really has very minimal effort put to it at this time.

*version 1.1 10/22/2011 Al Anderson*