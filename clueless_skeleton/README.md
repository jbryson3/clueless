Clueless Skeleton
=================

The code here has basic support for the currently defined messages in the Communications Messages.xlsx file located in the Team BAM Shared Dropbox directory. On the server side, the stub message receive functions are located in the clueless_socket_server.js file. A sample bit of a stubbed message function is show here:

`    socket.on('clientPlayerJoinGame', function(player) {
	    putsMessage(['clientPlayerJoinGame', player]);
	    io.sockets.emit('bdcstPlayerJoinedGame', player)
    });`

This function will be called when a `clientPlayerJoinGame` message is received by the server. It will use the `putsMessage` function to print out the message to the console for logging and debugging purposes. It will then emit a `bdcstPlayerJoinedGame` message to all the clients with the player that joined as data.


*version 1.0 10/22/2011 Al Anderson*