Location = function(){
	this.name='';
	this.adjoiningRooms= new Array();
	this.currentOccupant='';
}

Location.prototype.initialize = function(name,adjoiningRooms){
	this.name=name;
	this.adjoiningRooms=adjoiningRooms;
}

module.exports=Location;