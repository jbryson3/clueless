
function selectWeapon(weapon){
	$("#weaponsuggestion").text("You have suggested a "+ weapon +" was used");
	suggestion.sWeapon=weapon;
	$("#gun").css("border", "0px solid #FF0000");
	$("#knife").css("border", "0px solid #FF0000");
	$("#candlestick").css("border", "0px solid #FF0000");
	$("#"+weapon).css("border", "2px solid #FF0000");
	console.log(suggestion);		
}
	


var suggestion = {
	sName:"",
	sWeapon:"",
	sRoom:""
}

var $input, socket;
socket = io.connect();
socket.on('connect', function() {
  return $("#status").text('Connected');
});
socket.on('disconnect', function() {
  return $("#status").text('Disconnected');
});
socket.on('reconnecting', function(seconds) {
  return $("#status").text("Reconnecting in " + seconds + " seconds");
});
socket.on('reconnect', function() {
  return $("#status").text('Reconnected');
});
socket.on('reconnect_failed', function() {
  return $("#status").text('Failed to reconnect');
});

socket.on("toomanyplayers", function(message){
  $("#status").text("Too Many Players!");	
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
	$("#broadcast").text(player + " joined game");
});

$input = $("#playerName");
$("#joinGame").click(function() {
  socket.emit("clientPlayerJoinGame", $input.val());
  $("#status").text('Name set to '+$input.val());
	$("#joinGame").hide();
	$("#playerName").hide();
	
  return $input.val('').focus();
});

$("#gun").click(function(){
	selectWeapon("gun");
});
	
$("#knife").click(function(){
	selectWeapon("knife");
});

$("#candlestick").click(function(){
	selectWeapon("candlestick");
});
