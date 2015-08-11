var Character = function () {

    this.MISSED = 0;
    this.HITTED = 1;
    this.HITTED_RAISE = 2;

    this.combatVal = 4;
    this.vigor = 4;
    this.armour = 0;
    this.wound = 0;
    this.shaken = false;
    this.benny = 3;
    this.damageSide = 6;
    this.damageNumber = 2;
    this.damageOffset = 0;
    this.target = undefined;

    this.reset = function () {
        this.wound = 0;
        this.shaken = false;
        this.target = undefined;
    };

    this.addTarget = function (target) {
        this.target = target;
    };

    this.getToughness = function () {
        return 2 + this.vigor / 2 + this.armour;
    };

    this.getParry = function () {
        return 2 + this.combatVal / 2;
    };

    this.roll = function (side) {
        var dice = 0;
        do {
            var roll = Math.ceil(Math.random() * side);
            dice += roll;
        } while (roll === side);

        return dice;
    };

    this.jokerRoll = function (side) {
        return Math.max(this.roll(side), this.roll(6));
    };

    this.getCombatRoll = function () {
        if (this.shaken) {
            return 0;
        }

        return this.jokerRoll(this.combatVal) + this.wound;
    };

    this.getDamageRoll = function (raise) {
        var dam = this.damageOffset;
        for (var k = 0; k < this.damageNumber; k++) {
            dam += this.roll(this.damageSide);
        }

        if (raise === true) {
            dam += this.roll(6);
        }

        return dam;
    };

    this.isHitted = function (attVal) {
        if (attVal >= (this.getParry() + 4)) {
            return this.HITTED_RAISE;
        } else if (attVal >= this.getParry()) {
            return this.HITTED;
        }

        return this.MISSED;
    };

    this.inflictDamage = function (dam) {
        delta = dam - this.getToughness();

        if (delta >= 0) {
            wounds = Math.floor(delta / 4);
            if (wounds > 0) {
                this.shaken = true;
                this.wound -= wounds;
            } else {
                if (this.shaken) {
                    this.wound--;
                } else {
                    this.shaken = true;
                }
            }
        }
    };

    this.runTurn = function () {
        this.shaken = false;

        var attackValue = this.getCombatRoll();
        var hitted = this.target.isHitted(attackValue);

        var damage = 0;
        switch (hitted) {
            case this.HITTED :
                damage = this.getDamageRoll();
                break;
            case this.HITTED_RAISE :
                damage = this.getDamageRoll(true);
                break;
        }

        this.target.inflictDamage(damage);
    };
};

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
}

var pj = new Character();
var pnj = new Character();

var stat = [];
//for (var k = 0; k < 10; k++) {
//    var res = Combat.getResult(pj, pnj);
//    stat[res]++;
//}


console.log(stat)


