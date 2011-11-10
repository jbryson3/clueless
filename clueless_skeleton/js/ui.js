$('#dialog').dialog({
	autoOpen: false,
	modal: true,
	width: 600,
	buttons: {
		"Yes": function() { 
			$(this).dialog("close"); 
			joinGame($('#dlgNameInput').val());
		}, 
		"No": function() { 
			$(this).dialog("close"); 
		} 
	}
});

var setDlgButtons = function(btnName){
	var button_name = btnName;

	var dialog_buttons = $('#dlgPickPiece').dialog('option', 'buttons');

	dialog_buttons[button_name] = function(){
		chosePiece(btnName);
	};
	$('#dlgPickPiece').dialog({ buttons: dialog_buttons });
};

var mustardAvailable = true;
var greenAvailable = true;
var peacockAvailable = false;
var scarletAvailable = false;
var whiteAvailable = true;
var plumAvailable = false;

$('#dlgPickPiece').dialog({
	autoOpen: false,
	modal: true,
	width: 100
});


if (mustardAvailable==true){
	setDlgButtons('Mr. Mustard');
};
if (greenAvailable==true){
	setDlgButtons('Mr. Green');
};
if (peacockAvailable==true){
	setDlgButtons('Mrs. Peacock');
};
if (scarletAvailable==true){
	setDlgButtons('Ms. Scarlet');
};
if (whiteAvailable==true){
	setDlgButtons('Mr. White');
};
if (plumAvailable==true){
	setDlgButtons('Mr. Plum');
};


$('#btnAction').click(function(){
	Delete_Cookie('gameStatus','/','');
	return false;
});

$('#btnChkStatus').click(function(){
	writeLog(status);
	return false;
});


$('#imgGreen').click(function(){
	writeLog("Green Selected");
	$('#dlgPickPiece').dialog('close');
	return false;
});
