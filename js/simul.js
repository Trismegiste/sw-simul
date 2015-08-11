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
});

$('#pulsa-start').click(function (event) {
    event.stopPropagation();
    event.preventDefault();

    model.forEach(function (charact, k) {
        charact.vigor = parseInt($('div[data-model-pk=' + k + '] input[name=vigor]').val());
        charact.armour = parseInt($('div[data-model-pk=' + k + '] input[name=armour]').val());
        charact.combatVal = parseInt($('div[data-model-pk=' + k + '] input[name=combat]').val());
    });

    model.forEach(function (pnj, k) {
        if (k > 0) {
            var result = Combat.runSimul(model[0], pnj, 10000);
            $('div[data-model-pk=' + k + '] .result .victory').text(result[1]);
            $('div[data-model-pk=' + k + '] .result .defeat').text(result[2]);
            $('div[data-model-pk=' + k + '] .result .draw').text(result[3]);
        }
    });

});