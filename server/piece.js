Piece  = function(){
	this.name = '';
	this.playerName='';
	this.available='';
	this.location='';
}

Piece.prototype.initialize = function(name,available){
	this.name = name;
	this.available=available;	
}

Piece.prototype.getPieceByName = function(name,pieces){
		for (var i=0;i<pieces.length;i++){
		if (pieces[i].name == name){
			return pieces[i];
		}
	}
	return null;
}

module.exports=Piece;
