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


$('#dlgPickPiece').dialog({
	autoOpen: false,
	modal: true,
	width: 100
});

var setupChoseDialog = function(){
	if (pieces[0].available==true){
		setDlgButtons('Mr. Mustard');
	};
	if (pieces[1].available==true){
		setDlgButtons('Mr. Green');
	};
	if (pieces[2].available==true){
		setDlgButtons('Mrs. Peacock');
	};
	if (pieces[3].available==true){
		setDlgButtons('Ms. Scarlet');
	};
	if (pieces[4].available==true){
		setDlgButtons('Mr. White');
	};
	if (pieces[5].available==true){
		setDlgButtons('Mr. Plum');
	};
}

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
