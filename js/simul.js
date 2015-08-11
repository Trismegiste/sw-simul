var pj = new Character();
var pnj = new Character();

var stat = [0, 0, 0, 0];
for (var k = 0; k < 10000; k++) {
    var res = Combat.getResult(pj, pnj);
    stat[res]++;
    res = Combat.getResult(pnj, pj);
    if (res === 2) {
        res = 1
    } else if (res === 1) {
        res = 2
    }
    stat[res]++;
}


console.log(stat)


