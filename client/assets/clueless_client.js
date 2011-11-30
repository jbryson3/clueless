$(document).ready(function(){

	//Variables
	var players = new Array();
	var myName = '';
	
	//Setting up events
	$('#btn_spectate').click(function(){
		$('#login_message').hide();
		var name = $('#input_playerName').val();
		if(name){
			socket.emit("checkAvailableName", name, function(data){
				if(data == "true"){
					socket.emit("spectatorJoin", name);
					myName = name;
					$.fancybox.close();
				}else{
					$('#login_message').html('Name in use. Pick another one please.').show();
				}
			});	
		}else{
			$('#login_message').html('Please enter your name!').show();
		}
	});	
	
	$('#btn_play').click(function(){
		$('#login_message').hide();
		var name = $('#input_playerName').val();
		if(name){
			socket.emit("checkAvailableName", name, function(data){
				if(data == "true"){
					socket.emit("clientPlayerJoinGame", name);
					myName = name;
					$.fancybox.close();
				}else{
					$('#login_message').html('Name in use. Pick another one please.').show();
				}
			});	
		}else{
			$('#login_message').html('Please enter your name!').show();
		}
	});	
	
	var allowSendMessage = true;
	$('#chatText').keypress(function(evt){
		if(evt.which == 13){
			var msg = $(this).val()
			if(msg && allowSendMessage){
				$(this).val('');
				appendChat( msg, myName );
				socket.emit("chatMessage", msg);
				allowSendMessage = false;
				setTimeout(function(){
					allowSendMessage = true;
				},1000);
			}
		}
	});
	



	// Socket IO stuff
	var socket;
	socket = io.connect();
	socket.on('connect', function() {
	  appendStatus('Connected');
	  socket.emit("getPlayers", function(playerArray){
		players = playerArray;
		for(var i=0; i<players.length; i++){
			if(players[i].type == 'player'){
				$('#player_list ul').append('<li name="'+players[i].name+'">'+players[i].name+'</li>');
			}else{
				$('#spectator_list ul').append('<li name="'+players[i].name+'">'+players[i].name+'</li>');
			}
		}
	  });
	});
	socket.on('disconnect', function() {
	  appendStatus('Disconnected');
	});
	socket.on('reconnecting', function(seconds) {
	 appendStatus("Reconnecting in " + seconds + " seconds");
	});
	socket.on('reconnect', function() {
	  appendStatus('Reconnected');
	});
	socket.on('reconnect_failed', function() {
	  appendStatus('Failed to reconnect');
	});

	socket.on("toomanyplayers", function(message){
	  appendStatus("Too Many Players!");	
	})

	socket.on('updateplayers', function(message) {
		var playerArray = jQuery.makeArray(message);
		$("#messages").children().remove();
		$.each(playerArray, function(name){
			$('<li>').text(playerArray[name]).appendTo($('#messages'));
		});
		return;
	});

	socket.on('bdcstPlayerJoinedGame', function(player){
		appendStatus(player.name + " joined game");
		if(player.type == 'player'){
			$('#player_list ul').append('<li name="'+player.name+'">'+player.name+'</li>');
		}else{
			$('#spectator_list ul').append('<li name="'+player.name+'">'+player.name+'</li>');
		}
	});

	socket.on('bdcstPlayerLeftGame', function(player){
		appendStatus(player.name + " left game");
		if(player.type == 'player'){
			$('#player_list ul li').each(function(){
				if( $(this).attr('name') == player.name ){
					$(this).remove();
				}
			});
		}else{
			$('#spectator_list ul li').each(function(){
				//alert("Comparing: " + $(this).attr('name') + " with: " + player.name);
				if( $(this).attr('name') == player.name ){
					$(this).remove();
				}
			});
		}
	});

	$("#joinGame").click(function() {
	  socket.emit("clientPlayerJoinGame", $input.val());
	});
	
	socket.on('bdcstChat', function(message, player){
		appendChat(message, player.name);
	});

	//Functions
	function appendStatus(message){
		var status = $('#status').html();
		status += message + "<br/>";
		$('#status').html(status);
		var objDiv = document.getElementById('status');
		objDiv.scrollTop = objDiv.scrollHeight;
	}	

	function appendChat(message, name){
		var chat = $('#chat').html();
		chat += "[ "+name+" ]:  " + message + "<br/>";
		$('#chat').html(chat);
		var objDiv = document.getElementById('chat');
		objDiv.scrollTop = objDiv.scrollHeight;
	}	

});