$(document).ready(function(){

	//Variables
	var players = new Array();
	var myName = '';
	var type = '';
	
	//Setting up events
	$('#btn_spectate').click(function(){
		$('#login_message').hide();
		var name = $('#input_playerName').val();
		if(name){
			socket.emit("checkName", name, function(data){
				if(!data){
					socket.emit("spectatorJoinGame", name);
					myName = name;
					type = 'spectator';
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
			socket.emit("checkName", name, function(data){
				if(!data){
					socket.emit("playerJoinGame", name);
					myName = name;
					type='player';
					$.fancybox.close();
					
					$('#btn_actions_ready').show();
				}else{
					$('#login_message').html('Name in use. Pick another one please.').show();
				}
			});	
		}else{
			$('#login_message').html('Please enter your name!').show();
		}
	});	
	
	$('#btn_actions_ready').click(function(){
		socket.emit('playerReady');
		$('#btn_actions_ready').hide();
	});
	
	var allowSendMessage = true;
	$('#chatText').keypress(function(evt){
		if(evt.which == 13){
			var msg = $(this).val()
			if(msg && allowSendMessage){
				$(this).val('');
				appendChat( msg, myName );
				socket.emit("playerChatMessage", msg);
				allowSendMessage = false;
				setTimeout(function(){
					allowSendMessage = true;
				},1000);
			}
		}
	});

	$("#joinGame").click(function() {
	  socket.emit("clientPlayerJoinGame", $input.val());
	});
	
	// Socket IO stuff
	var socket;
	socket = io.connect();
	socket.on('connect', function() {
	  appendStatus('Connected');
	  socket.emit("getPlayers", function(state){
		$('#players_ready').html(state.readyPlayers);
		$('#total_players').html(state.totalPlayers);
		players = state.players;
		for(var i=0; i<players.length; i++){
			if(players[i].type == 'player'){
				var color = players[i].ready ? 'green' : 'auto';
				$('#player_list ul').append('<li style="color:'+ color +';" name="'+players[i].name+'">'+players[i].name+'</li>');
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
	});
	
	socket.on("prematureEndGame", function(){
		appendStatus("The game has ended prematurely.");
		//Close any open modal windows
		$.fancybox.close();
		
		//Tell the client what happened (must wait 1 sec until opening another 
		//modal screen after closing for some reason or they both close)
		setTimeout(function(){
			$('#modal_alert_content').html("<div>Sorry, a player disconnected and the game has ended!</div><input type='button' onClick='$.fancybox.close();' value='Ok'/>");
			$('#modal_alert').fancybox({
				'hideOnOverlayClick' : false,
				'enableEscapeButton' : false,
				'showCloseButton' : false
			}).click();
		},1000);
		
		//Coloring all players black
		$('#player_list ul li').each(function(){
			$(this).css('color','black');
		});
		
		if(type=='player'){
			$('#btn_actions_ready').show();
		}
	});
	
	socket.on("startGame", function(){
		appendStatus("The game has started.");
		$.fancybox.close();
		$('#modal_alert_content').html("<div>The game has begun!</div><input type='button' onClick='$.fancybox.close();' value='Ok'/>");
		$('#modal_alert').fancybox({
			'hideOnOverlayClick' : false,
			'enableEscapeButton' : false,
			'showCloseButton' : false
		}).click();
	});

	socket.on('updateplayers', function(message) {
		var playerArray = jQuery.makeArray(message);
		$("#messages").children().remove();
		$.each(playerArray, function(name){
			$('<li>').text(playerArray[name]).appendTo($('#messages'));
		});
		return;
	});

	socket.on('playerJoinedGame', function(player){
		appendStatus(player.name + " joined game");
		if(player.type == 'player'){
			$('#player_list ul').append('<li name="'+player.name+'">'+player.name+'</li>');
			$('#total_players').html( parseInt($('#total_players').html())+1 );
		}else{
			//player.type == spectator
			$('#spectator_list ul').append('<li name="'+player.name+'">'+player.name+'</li>');
		}
	});


	socket.on('playerLeftGame', function(player, ready, total){
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
		$('#players_ready').html(ready);
		$('#total_players').html(total);
	});

	
	socket.on('bdcstChat', function(message, player){
		appendChat(message, player.name);
	});
	
	socket.on('playerIsReady', function(name){
		appendStatus(name + " is ready!");
		$('#players_ready').html( parseInt($('#players_ready').html())+1 );
		
		//Coloring the ready player green
		$('#player_list ul li').each(function(){
			if( $(this).attr('name') == name ){
				$(this).css('color','green');
			}
		});
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