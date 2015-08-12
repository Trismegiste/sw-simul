var Character = function () {

    this.MISSED = 0;
    this.HITTED = 1;
    this.HITTED_RAISE = 2;

    this.combatVal = 4;
    this.shootingVal = 4;
    this.vigor = 4;
    this.spirit = 4;
    this.strength = 4;
    this.armour = 0;
    this.meleeWeapon = 6;
    this.hardToKill = 0;
    this.dodge = 0;
    this.rangeWeaponDice = 6;
    this.rangeWeaponNumber = 2;

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
        return Math.max(-this.wound + this.hardToKill, 0);
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

    this.getShootingRoll = function () {
        return this.jokerRoll(this.shootingVal);
    };

    this.getMeleeDamage = function (raise) {
        var dam = this.roll(this.strength);
        dam += this.roll(Math.max(this.strength, this.meleeWeapon));

        if (raise === true) {
            dam += this.roll(6);
        }

        return dam;
    };

    this.getRangeDamage = function (raise) {
        var dam = 0;
        for (var k = 0; k < this.rangeWeaponNumber; k++) {
            dam += this.roll(this.rangeWeaponDice);
        }

        if (raise === true) {
            dam += this.roll(6);
        }

        return dam;
    };

    this.isMeleeHitted = function (attVal) {
        if (attVal >= (this.getParry() + 4)) {
            return this.HITTED_RAISE;
        } else if (attVal >= this.getParry()) {
            return this.HITTED;
        }

        return this.MISSED;
    };

    this.getDodge = function () {
        return 4 + this.dodge;
    };

    this.isRangeHitted = function (attVal) {
        if (attVal >= (this.getDodge() + 4)) {
            return this.HITTED_RAISE;
        } else if (attVal >= this.getDodge()) {
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

        if (this.wound > 3) {
            this.incapacited = true;
        }
    };

    this.attemptUnshaken = function () {
        // spirit roll
        if (this.jokerRoll(this.spirit) >= 8) {
            this.shaken = false;
        }
    };

    this.runTurn = function (mode) {
        this.attemptUnshaken();

        // unshaken
        if (this.shaken && (this.benny > 0)) {
            this.shaken = false;
            this.benny--;
        }

        if (this.shaken || this.incapacited) {
            return;
        }

        var attackValue, hitted, damage;

        if (mode === 'melee') {
            attackValue = this.getCombatRoll();
            hitted = this.target.isMeleeHitted(attackValue);
            switch (hitted) {
                case this.HITTED :
                    damage = this.getMeleeDamage();
                    break;
                case this.HITTED_RAISE :
                    damage = this.getMeleeDamage(true);
                    break;
            }
        } else if (mode === 'range') {
            attackValue = this.getShootingRoll();
            hitted = this.target.isRangeHitted(attackValue);
            switch (hitted) {
                case this.HITTED :
                    damage = this.getRangeDamage();
                    break;
                case this.HITTED_RAISE :
                    damage = this.getRangeDamage(true);
                    break;
            }
        }


        this.target.receiveDamage(damage);
    };
};
