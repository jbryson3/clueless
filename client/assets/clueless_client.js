$(document).ready(function(){

	//Variables
	var players = new Array();
	var myName = '';
	var type = '';
	var myPiece = '';
	var myRoom = '';
	
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
	
	/*$('.room_clickable').hover(function(){
			$(this).css('background-color','red');
		},function(){
			$(this).css('background-color','lightGray');
	}).click(function(){
		alert( $(this).attr('id') );
	});*/
	
	$('.room_can_click').live("mouseover", function(){
		$(this).css('background-color','orange');
	}).live("mouseout", function(){
		$(this).css('background-color','darkorange');
	}).live("click", function(){
		socket.emit("playerLocationChosen", $(this).attr('id'));
		$('.room_can_click').each(function(){
			$(this).css('background-color', 'lightGray').removeClass('room_can_click');
		});
		//moveTo(myPiece, $(this).attr('id'));
		if($(this).hasClass('room')){
			$('#btn_actions_suggestion').show();
		}
		$('#btn_actions_endTurn').show();
		myRoom = $(this).attr('id');
	});
	
	$('#btn_actions_suggestion').click(function(){
		$('#suggestion_title_piece').html( $('.suggestion_pieces:checked').next().html() );
		$('#suggestion_title_weapon').html( $('.suggestion_weapons:checked').next().html() );
		$('#suggestion_title_room').html( getRoomforID(myRoom) );
		
		$('#modal_suggestion').fancybox({
			'hideOnOverlayClick' : false,
			'enableEscapeButton' : false,
			'showCloseButton' : false
		}).click();
		
	});
	
	$('#btn_suggest').live("click", function(){
		var suggestion = new Object();
		suggestion.weapon = getWeaponforName($('.suggestion_weapons:checked').next().html());
		suggestion.character = $('.suggestion_pieces:checked').next().html();
		suggestion.room = myRoom;
		socket.emit("playerSuggestion", suggestion);
		
		
		$('.room_can_click').each(function(){
			$(this).css('background-color', 'lightGray').removeClass('room_can_click');
		});
		$('#btn_actions_suggestion').hide();
		$.fancybox.close();
	});
	
	$('#btn_actions_accusation').click(function(){
		$('#accusation_title_piece').html( $('.accusation_pieces:checked').next().html() );
		$('#accusation_title_weapon').html( $('.accusation_weapons:checked').next().html() );
		$('#accusation_title_room').html( $('.accusation_rooms:checked').next().html() );
		
		$('#modal_accusation').fancybox({
			'hideOnOverlayClick' : false,
			'enableEscapeButton' : false,
			'showCloseButton' : false
		}).click();
	});
	
	$('#btn_accuse').live("click", function(){
		var accusation = new Object();
		accusation.weapon = getWeaponforName($('.accusation_weapons:checked').next().html());
		accusation.character = $('.accusation_pieces:checked').next().html();
		accusation.room = getRoomforName($('.accusation_rooms:checked').next().html());
		socket.emit("playerAccusation", accusation);
		
		
		$('.room_can_click').each(function(){
			$(this).css('background-color', 'lightGray').removeClass('room_can_click');
		});
		
		$('#'+myPiece).css('border','0');
		$('#move_text').hide();
		$('#btn_actions_suggestion').hide();
		$('#btn_actions_accusation').hide();
		$('#btn_actions_endTurn').hide();
		$.fancybox.close();
	});
	
	$('.suggestion_pieces').click(function(){
		if( $(this).is(':checked') ){
			$('#suggestion_title_piece').html( $(this).next().html() );
		}
	});
	
	$('.suggestion_weapons').click(function(){
		if( $(this).is(':checked') ){
			$('#suggestion_title_weapon').html( $(this).next().html() );
		}
	});
	
	$('.accusation_pieces').click(function(){
		if( $(this).is(':checked') ){
			$('#accusation_title_piece').html( $(this).next().html() );
		}
	});
	
	$('.accusation_weapons').click(function(){
		if( $(this).is(':checked') ){
			$('#accusation_title_weapon').html( $(this).next().html() );
		}
	});
	
	$('.accusation_rooms').click(function(){
		if( $(this).is(':checked') ){
			$('#accusation_title_room').html( $(this).next().html() );
		}
	});
	
	$('#btn_actions_endTurn').click(function(){
		$('#btn_actions_suggestion').hide();
		$('#btn_actions_accusation').hide();
		$('#btn_actions_endTurn').hide();
		socket.emit("playerEndTurn");
	});
	
	$('#disprove_suggestion').live("click", function(){
		socket.emit('playerDisprovedSuggestion', $('.disprove_choice:checked').next().html());
		$.fancybox.close();
	});
	
	$('input:checkbox').removeAttr('checked');
	
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
	
	socket.on("playerSuspended", function(player){
		appendStatus(player.name + "'s accusation was wrong and can no longer move or win.");	
	});
	
	socket.on("playerWonByAccusation", function(player){
		appendStatus(player.name + " guessed everything correctly and won the game!");	
		
		var content;
		if(player.name == myName){
			content = "<div style='text-align:center;'><h1>Congratulations! You won!</h1><input type='button' onClick='$.fancybox.close()' value='Ok'/></div>";
		}else{
			content = "<div style='text-align:center;'><h1>"+player.name+" has won the game!</h1><input type='button' onClick='$.fancybox.close()' value='Ok'/></div>";		
		}
		
		//Close any open modal windows
		$.fancybox.close();
		
		//Tell the client what happened (must wait 1 sec until opening another 
		//modal screen after closing for some reason or they both close)
		setTimeout(function(){
			$('#modal_alert_content').html(content);
			$('#modal_alert').fancybox({
				'hideOnOverlayClick' : false,
				'enableEscapeButton' : false,
				'showCloseButton' : false
			}).click();
		},1000);
		
		endGame();
	});
	
	socket.on("playerWonByDefault", function(player){
		var content;
		if(player.name == myName){
			content = "<div style='text-align:center;'><h1>Congratulations! You won!</h1><input type='button' onClick='$.fancybox.close()' value='Ok'/></div>";
		}else{
			content = "<div style='text-align:center;'><h1>"+player.name+" has won the game!</h1><input type='button' onClick='$.fancybox.close()' value='Ok'/></div>";		
		}
		
		//Close any open modal windows
		$.fancybox.close();
		
		//Tell the client what happened (must wait 1 sec until opening another 
		//modal screen after closing for some reason or they both close)
		setTimeout(function(){
			$('#modal_alert_content').html(content);
			$('#modal_alert').fancybox({
				'hideOnOverlayClick' : false,
				'enableEscapeButton' : false,
				'showCloseButton' : false
			}).click();
		},1000);
		
		appendStatus(player.name + " has won because everyone else has lost!");	
		endGame();
	});
	
	socket.on("suggestionDisproved", function(player, data){
		var content = "<div style='text-align:center;'><h1>Your suggestion was disproved</h1><p>"+player.name+" has showed you the "+ data +" card.</p><input type='button' onClick='$.fancybox.close()' value='Ok'/></div>";
		
		$('#modal_alert_content').html(content);
		$('#modal_alert').fancybox({
			'hideOnOverlayClick' : false,
			'enableEscapeButton' : false,
			'showCloseButton' : false
		}).click();
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
		
		$('#cards').html('');
	});
	
	socket.on("startGame", function(turnList){
		appendStatus('All pieces have been chosen. Let the game begin!');
		$.fancybox.close();
		
		$('.board').show();
		$('#board_waiting').hide();
		
		
		for(var i=0; i<turnList.length; i++){
			if(turnList[i].name == myName){
				myRoom = turnList[i].piece.location.name;
			}
			$('#' + turnList[i].piece.location.name).append('<div id="'+getPieceforName(turnList[i].piece.name)+'" class="piece" style="position:relative; top:35%; left:35%;"></div>');
		}
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

	socket.on('startTurn', function(piece, locations){
		//Setting up locations that can be clicked
		for(var i=0; i<locations.length; i++){
			$('#' + locations[i].name).addClass('room_can_click').css({
				'background-color':'darkorange',
				'cursor':'pointer'
			});
		}
		
		$('#btn_actions_accusation').show();
		$('#'+getPieceforName(piece)).css('border','2px solid black');
		$('#move_text').show();
	});
	
	socket.on('bdcstChat', function(message, player){
		appendChat(message, player.name);
	});
	
	socket.on('aPlayerLocationChosen', function(player){
		appendStatus(player.name + " has moved " + player.piece.name + " to " + getRoomforID(player.piece.location.name));
		moveTo(getPieceforName(player.piece.name), player.piece.location.name);
		
		$('#move_text').hide();
	});
	
	socket.on('playerSuggestion', function(player, suggestion){
		appendStatus(player.name + " has made a suggestion. Was it " + suggestion.character + " with the " + suggestion.weapon + " in the " + suggestion.room + "?");
	});
	
	socket.on('disproveSuggestion', function(cards){
		$('#disprove_choices').html('');
		for(var i=0; i<cards.length; i++){
			if(i==0){
				$('#disprove_choices').append('<input type="radio" name="disprove_choice" class="disprove_choice" checked="checked"/><span>'+cards[i].value+'</span><br/>');
			}else{
				$('#disprove_choices').append('<input type="radio" name="disprove_choice" class="disprove_choice" /><span>'+cards[i].value+'</span><br/>');
			}
		}
		
		$('#modal_disprove').fancybox({
			'hideOnOverlayClick' : false,
			'enableEscapeButton' : false,
			'showCloseButton' : false
		}).click();
	});
	
	socket.on('reset', function(){
		appendStatus('The game has been reset.');
		$('#players_ready').html('0');
		$('#player_list ul li').each(function(){
			$(this).css('color', 'black');
		});
		$('.room_can_click').each(function(){
			$(this).css('background-color', 'lightGray').removeClass('room_can_click');
		});
	});
	
	socket.on('alert', function(message){
		appendStatus(message);
	});
	
	socket.on('availablePieces', function(availablePieces){
		
		var content = '<h1>Choose your piece</h1>';
		for(var i=0; i<availablePieces.length; i++){
			if(i==0){
				content += availablePieces[i].available ? '<input type="radio" name="choose_pieces" class="choose_pieces" checked="checked"/><span>' + availablePieces[i].name + '</span><br />' : '<input type="radio" disabled="disabled"><span>' + availablePieces[i].name + '</span><br />';
			}else{
				content += availablePieces[i].available ? '<input type="radio" name="choose_pieces" class="choose_pieces" /><span>' + availablePieces[i].name + '</span><br />' : '<input type="radio" disabled="disabled"><span>' + availablePieces[i].name + '</span><br />';
			}
		}
		content += "<input id='btn_choosePiece' type='button' value='Choose Piece' />";
		
		$.fancybox.close();
		//Tell the client what happened (must wait 1 sec until opening another 
		//modal screen after closing for some reason or they both close)
		setTimeout(function(){
			$('#modal_alert_content').html(content);
			$('#modal_alert').fancybox({
				'hideOnOverlayClick' : false,
				'enableEscapeButton' : false,
				'showCloseButton' : false
			}).click();
		},1000);
		
		$('#btn_choosePiece').live("click", function(){
			var piece = '';
			$('.choose_pieces').each(function(){
				if( $(this).is(':checked') ){
					piece = $(this).next().html();
				}
			});
		
			socket.emit("playerChoseGamePiece", piece);
			myPiece = getPieceforName(piece);
			$.fancybox.close();
		});
		
	});
	
	socket.on('dealtCards', function(cards){
		appendStatus("The cards have been dealt.");
		for(var i=0; i<cards.length; i++){
			var type = cards[i].type == 'weapons' ? '-->' : cards[i].type == 'rooms' ? '[ ]' : ':-)'
			$('#cards').append('<div>'+type+' '+cards[i].value+'</div>');
		}
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
	function endGame(){
		//The game has ended
		$('.board').hide();
		$('#board_waiting').show();
		$('#cards').html('');
		$('.piece').each(function(){$(this).remove();});
		$('#btn_actions_ready').show();
		$('#btn_actions_suggestion').hide();
		$('#btn_actions_accusation').hide();
		$('#btn_actions_endTurn').hide();
		$('#move_text').hide();
		$('input:checkbox').removeAttr('checked');
	}
	
	function moveTo(piece, location){
		$('#'+piece).remove();
		$('#' + location).append('<div id="'+piece+'" class="piece"></div>');
		if( !$('#'+piece).parent().hasClass('room') ){
			$('#'+piece).css({
				'position':'relative',
				'top':'35%',
				'left':'35%'
			});
		}
	}
	
	function getPieceforName(name){
		switch(name){
			case 'Miss Scarlet':
				return 'miss_scarlet';
			case 'Colonel Mustard':
				return 'col_mustard';
			case 'Mrs. White':
				return 'mrs_white';
			case 'Mr. Green':
				return 'mr_green';
			case 'Mrs. Peacock':
				return 'mrs_peacock';
			case 'Professor Plum':
				return 'prof_plum';
			default:
				return false;
		}
	}
	
	function getPieceforID(id){
		switch(name){
			case 'miss_scarlet':
				return 'Miss Scarlet';
			case 'col_mustard':
				return 'Colonel Mustard';
			case 'mrs_white':
				return 'Mrs. White';
			case 'mr_green':
				return 'Mr. Green';
			case 'mrs_peacock':
				return 'Mrs. Peacock';
			case 'prof_plum':
				return 'Professor Plum';
			default:
				return false;
		}
	}
	
	function getWeaponforName(name){
		switch(name){
			case 'Knife':
				return 'knife';
			case 'Candlestick':
				return 'candlestick';
			case 'Pistol':
				return 'pistol';
			case 'Rope':
				return 'rope';
			case 'Lead Pipe':
				return 'lead_pipe';
			case 'Wrench':
				return 'wrench';
			default:
				return false;
		}
	}
	function getWeaponforID(id){
		switch(id){
			case 'knife':
				return 'Knife';
			case 'candlestick':
				return 'Candlestick';
			case 'pistol':
				return 'Pistol';
			case 'rope':
				return 'Rope';
			case 'lead_pipe':
				return 'Lead Pipe';
			case 'wrench':
				return 'Wrench';
			default:
				return false;
		}
	}
	
	function getRoomforID(id){
		switch(id){
			case 'kitchen':
				return 'Kitchen';
			case 'ballroom':
				return 'Ballroom';
			case 'conservatory':
				return 'Conservatory';
			case 'dining_room':
				return 'Dining Room';
			case 'library':
				return 'Library';
			case 'billiard_room':
				return 'Billiard Room';
			case 'lounge':
				return 'Lounge';
			case 'hall':
				return 'Hall';
			case 'study':
				return 'Study';
			case 'hall_1':
				return 'Hall 1';
			case 'hall_2':
				return 'Hall 2';
			case 'hall_3':
				return 'Hall 3';
			case 'hall_4':
				return 'Hall 4';
			case 'hall_5':
				return 'Hall 5';
			case 'hall_6':
				return 'Hall 6';
			case 'hall_7':
				return 'Hall 7';
			case 'hall_8':
				return 'Hall 8';
			case 'hall_9':
				return 'Hall 9';
			case 'hall_10':
				return 'Hall 10';
			case 'hall_11':
				return 'Hall 11';
			case 'hall_12':
				return 'Hall 12';
			default:
				return false;
		}
	}
	function getRoomforName(name){
		switch(name){
			case 'Kitchen':
				return 'kitchen';
			case 'Ballroom':
				return 'ballroom';
			case 'Conservatory':
				return 'conservatory';
			case 'Dining Room':
				return 'dining_room';
			case 'Library':
				return 'library';
			case 'Billiard Room':
				return 'billiard_room';
			case 'Lounge':
				return 'lounge';
			case 'Hall':
				return 'hall';
			case 'Study':
				return 'study';
			case 'Hall 1':
				return 'hall_1';
			case 'Hall 2':
				return 'hall_2';
			case 'Hall 3':
				return 'hall_3';
			case 'Hall 4':
				return 'hall_4';
			case 'Hall 5':
				return 'hall_5';
			case 'Hall 6':
				return 'hall_6';
			case 'Hall 7':
				return 'hall_7';
			case 'Hall 8':
				return 'hall_8';
			case 'Hall 9':
				return 'hall_9';
			case 'Hall 10':
				return 'hall_10';
			case 'Hall 11':
				return 'hall_11';
			case 'Hall 12':
				return 'hall_12';
			default:
				case false:
		}
	}
	
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