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

    this.reset = function () {
        this.wound = 0;
        this.shaken = false;
    };

    this.getToughness = function () {
        return 2 + this.vigor / 2 + this.armour;
    };

    this.getParry = function () {
        return 2 + this.combat / 2;
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
        return Math.max([this.roll(side), this.roll(6)]);
    };

    this.getCombatRoll = function () {
        if (this.shaken) {
            return 0;
        }

        return this.jokerRoll(this.combat) + this.wound;
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

    this.getHitted = function (attVal) {
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
};

var pj = new Character();

var sum = 0;
for (var k = 0; k < 10000; k++) {
    sum += pj.getDamageRoll(false);
}
console.log(sum / 10000)


