var sys=require('sys');
CaseFile = function(){
	this.weaponCard='';
	this.characterCard='';
	this.roomCard='';
}

CaseFile.prototype.initialize = function(weaponCard,characterCard,roomCard){
	this.weaponCard=weaponCard;
	this.characterCard=characterCard;
	this.roomCard=roomCard;
}


CaseFile.prototype.printFile=function(){
	sys.puts("Case File");
	sys.puts(this.weaponCard);
	sys.puts(this.characterCard);
	sys.puts(this.roomCard);
	sys.puts(" ");
}

module.exports=CaseFile;