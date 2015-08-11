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
    }
};