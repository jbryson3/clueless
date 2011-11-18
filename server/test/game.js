var nameCount=0;
var readyToPlay=0;

$('#joinGame').click(function(){
  joinGame($('#playerName').val());
});

$('#btn1readytoplay').click(function(){
  socket.emit("playerReady", 'Al');
});

var writeLog = function (message){
	$("#textAreaLog").append(message+'\n');
}

var suggestion = {
	sName:"",
	sWeapon:"",
	sRoom:""
}

var pieces = new Array();
var $input, socket;

socket = io.connect();

socket.on('connect', function() {
  writeLog("connected");
});
socket.on('disconnect', function() {
  writeLog('Disconnected');
});
socket.on('reconnecting', function(seconds) {
  writeLog("Reconnecting in " + seconds + " seconds");
});
socket.on('reconnect', function() {
  writeLog('Reconnected');
});
socket.on('reconnect_failed', function() {
  writeLog('Failed to reconnect');
});

socket.on('aPlayerChoseGamePiece', function(message) {
  writeLog(message);
});


socket.on('playerIsReady', function(player){
  writeLog(player + " is ready to play!");
});


socket.on('chosePiece', function(player){
  writeLog('Choose a Piece');
});

socket.on('alert', function(message){
  writeLog(message);
});


socket.on('availablePieces', function(pieces){
  writeLog('The available pieces are:');
  for(var i=0; i<pieces.length;i++){
    writeLog(pieces[i].name);
  }
});


socket.on('dealtCards', function(cards){
  writeLog('Your cards are:');
  for(var i=0; i<cards.length;i++){
    writeLog(cards[i].value);
  }
});


socket.on('playerJoinedGame', function(player){
	writeLog("Server: " + player + " joined game");
});

var joinGame = function(name){
  socket.emit("playerJoinGame", name);
}

var chosePiece = function(piece){
  socket.emit("playerChoseGamePiece", piece);
  writeLog(piece+ " Selected");
  $('#dlgPickPiece').dialog('close');
  return false;
}

function Set_Cookie( name, value, expires, path, domain, secure ){
   writeLog("Cookie Set!");

  // set time, it's in milliseconds
  var today = new Date();
  today.setTime( today.getTime() );

  /*
  if the expires variable is set, make the correct
  expires time, the current script below will set
  it for x number of days, to make it for hours,
  delete * 24, for minutes, delete * 60 * 24
  */
  if ( expires )
  {
  expires = expires * 1000 * 60 * 60 * 24;
  }
  var expires_date = new Date( today.getTime() + (expires) );

  document.cookie = name + "=" +escape( value ) +
  ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
  ( ( path ) ? ";path=" + path : "" ) +
  ( ( domain ) ? ";domain=" + domain : "" ) +
  ( ( secure ) ? ";secure" : "" );
}

// this fixes an issue with the old method, ambiguous values
// with this test document.cookie.indexOf( name + "=" );
function Get_Cookie( check_name ) {
  // first we'll split this cookie up into name/value pairs
  // note: document.cookie only returns name=value, not the other components
  var a_all_cookies = document.cookie.split( ';' );
  var a_temp_cookie = '';
  var cookie_name = '';
  var cookie_value = '';
  var b_cookie_found = false; // set boolean t/f default f

  for ( i = 0; i < a_all_cookies.length; i++ )
  {
    // now we'll split apart each name=value pair
    a_temp_cookie = a_all_cookies[i].split( '=' );


    // and trim left/right whitespace while we're at it
    cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

    // if the extracted name matches passed check_name
    if ( cookie_name == check_name )
    {
      b_cookie_found = true;
      // we need to handle case where cookie has no value but exists (no = sign, that is):
      if ( a_temp_cookie.length > 1 )
      {
        cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
      }
      // note that in cases where cookie is initialized but no value, null is returned
      return cookie_value;
      break;
    }
    a_temp_cookie = null;
    cookie_name = '';
  }
  if ( !b_cookie_found )
  {
    return null;
  }
}

// this deletes the cookie when called
function Delete_Cookie( name, path, domain ) {
  writeLog("Cookie Deleted!");
  if ( Get_Cookie( name ) ) document.cookie = name + "=" +
    ( ( path ) ? ";path=" + path : "") +
    ( ( domain ) ? ";domain=" + domain : "" ) +
    ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}
  
