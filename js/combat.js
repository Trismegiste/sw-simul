var Combat = {
    DRAW: 3,
    ATTACKER: 1,
    DEFENDER: 2,
    getResult: function (att, def) {
        att.reset();
        def.reset();
        att.addTarget(def);
        def.addTarget(att);
        var counter = 0;

        do {
            // attacker attacks defender
            att.runTurn();
            // defender attacks attacker
            def.runTurn();
            counter++;
        } while ((att.wound > -3) && (def.wound > -3));

        var result = 0;
        if (att.wound <= -3) {
            result = this.DEFENDER;
        }
        if (def.wound <= -3) {
            result |= this.ATTACKER;
        }

        return result;
    },
    runSimul: function (att, def, counter) {
        var stat = [0, 0, 0, 0];
        for (var k = 0; k < counter; k++) {
            var res = Combat.getResult(att, def);
            stat[res]++;
            res = Combat.getResult(def, att);
            if (res === Combat.ATTACKER) {
                res = Combat.DEFENDER;
            } else if (res === Combat.DEFENDER) {
                res = Combat.ATTACKER;
            }
            stat[res]++;
        }

        return stat;
    }
};