var Combat = {
    DRAW: 3,
    ATTACKER: 1,
    DEFENDER: 2,
    getResult: function (att, def, mode) {
        att.reset();
        def.reset();
        att.addTarget(def);
        def.addTarget(att);
        var counter = 0;

        do {
            // attacker attacks defender
            att.runTurn(mode);
            // defender attacks attacker
            def.runTurn(mode);
            counter++;
        } while (!att.incapacited && !def.incapacited);

        var result = 0;
        if (att.incapacited) {
            result = this.DEFENDER;
        }
        if (def.incapacited) {
            result |= this.ATTACKER;
        }

        return result;
    },
    runSimul: function (att, def, counter, mode) {
        var stat = [0, 0, 0, 0];
        for (var k = 0; k < counter; k++) {
            var res = Combat.getResult(att, def, mode);
            stat[res]++;
            res = Combat.getResult(def, att, mode);
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