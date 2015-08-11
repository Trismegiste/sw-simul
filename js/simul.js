var pj = new Character();
pj.combatVal=6;
var pnj = new Character();

var stat = [0, 0, 0, 0];
for (var k = 0; k < 10000; k++) {
    var res = Combat.getResult(pj, pnj);
    stat[res]++;
    res = Combat.getResult(pnj, pj);
    if (res === Combat.ATTACKER) {
        res = Combat.DEFENDER;
    } else if (res === Combat.DEFENDER) {
        res = Combat.ATTACKER;
    }
    stat[res]++;
}


console.log(stat)


