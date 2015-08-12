var model = [
    new Character(),
    new Character(),
    new Character(),
    new Character()
];

model.forEach(function (charact, k) {
    $('div[data-model-pk=' + k + '] input[name=vigor]').val(charact.vigor);
    $('div[data-model-pk=' + k + '] input[name=armour]').val(charact.armour);
    $('div[data-model-pk=' + k + '] input[name=combat]').val(charact.combatVal);
    $('div[data-model-pk=' + k + '] input[name=hardtokill]').val(charact.hardToKill);
});

$('#pulsa-start').click(function (event) {
    event.stopPropagation();
    event.preventDefault();

    model.forEach(function (charact, k) {
        charact.vigor = parseInt($('div[data-model-pk=' + k + '] input[name=vigor]').val());
        charact.armour = parseInt($('div[data-model-pk=' + k + '] input[name=armour]').val());
        charact.combatVal = parseInt($('div[data-model-pk=' + k + '] input[name=combat]').val());
        charact.hardToKill = parseInt($('div[data-model-pk=' + k + '] input[name=hardtokill]').val());
    });

    model.forEach(function (pnj, k) {
        if (k > 0) {
            var repeat = 10000;
            var result = Combat.runSimul(model[0], pnj, repeat);
            $('div[data-model-pk=' + k + '] .result .victory').text(Math.round(result[1] / (2 * repeat) * 100));
            $('div[data-model-pk=' + k + '] .result .defeat').text(Math.round(result[2] / (2 * repeat) * 100));
            $('div[data-model-pk=' + k + '] .result .draw').text(Math.round(result[3] / (2 * repeat) * 100));
        }
    });

});