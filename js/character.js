var Character = function () {

    this.MISSED = 0;
    this.HITTED = 1;
    this.HITTED_RAISE = 2;

    this.combatVal = 4;
    this.vigor = 4;
    this.spirit = 6;
    this.armour = 0;
    this.damageSide = 6;
    this.damageNumber = 2;
    this.damageOffset = 0;

    this.reset = function () {
        this.wound = 0;
        this.shaken = false;
        this.target = undefined;
        this.benny = 3;
        this.incapacited = false;
    };
    this.reset();

    this.addTarget = function (target) {
        this.target = target;
    };

    this.getToughness = function () {
        return 2 + this.vigor / 2 + this.armour;
    };

    this.getParry = function () {
        return 2 + this.combatVal / 2;
    };

    this.getWoundPenalties = function ()
    {
        return -this.wound;
    };

    this.roll = function (side) {
        var dice = 0;
        do {
            var roll = Math.ceil(Math.random() * side);
            dice += roll;
        } while (roll === side);

        return dice;
    };

    this.jokerRoll = function (side, ignoreMalus) {
        var roll = Math.max(this.roll(side), this.roll(6));

        if (ignoreMalus !== true) {
            roll += this.getWoundPenalties();
        }

        return roll;
    };

    this.getCombatRoll = function () {
        return this.jokerRoll(this.combatVal);
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

    this.receiveDamage = function (dam) {
        delta = dam - this.getToughness();

        if (delta >= 0) {
            wounds = Math.floor(delta / 4);
            if (wounds > 0) {
                this.shaken = true;
                this.wound += wounds;
            } else {
                if (this.shaken) {
                    this.wound++;
                } else {
                    this.shaken = true;
                }
            }
        }
    };

    this.attemptUnshaken = function () {
        // spirit roll
        if (this.jokerRoll(this.spirit) >= 8) {
            this.shaken = false;
        }
    }

    this.runTurn = function () {
        this.attemptUnshaken();

        // unshaken
        if (this.shaken && (this.benny > 0)) {
            this.shaken = false;
            this.benny--;
        }

        if (this.shaken || this.incapacited) {
            return;
        }

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

        this.target.receiveDamage(damage);
    };
};
