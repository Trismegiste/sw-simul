var pj = new Character();
pj.combatVal=4;
var pnj = new Character();

var stat = Combat.runSimul(pj, pnj, 10000);

console.log(stat)


