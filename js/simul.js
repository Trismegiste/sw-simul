var model = [
    new Character(),
    new Character(),
    new Character(),
    new Character()
];

model.forEach(function (charact, k) {
    $('div[data-model-pk=' + k + '] input[type=number]').each(function (k, item) {
        var obj = $(item);
        obj.val(charact[obj.attr('name')]);
    });
});

$('#pulsa-start').click(function (event) {
    event.stopPropagation();
    event.preventDefault();

    var mode = $('select').val();

    model.forEach(function (charact, k) {
        $('div[data-model-pk=' + k + '] input[type=number]').each(function (k, item) {
            var obj = $(item);
            charact[obj.attr('name')] = parseInt(obj.val());
        });
    });

    model.forEach(function (pnj, k) {
        if (k > 0) {
            var repeat = 10000;
            var result = Combat.runSimul(model[0], pnj, repeat, mode);
            $('div[data-model-pk=' + k + '] .result .victory').text(Math.round(result[1] / (2 * repeat) * 100));
            $('div[data-model-pk=' + k + '] .result .defeat').text(Math.round(result[2] / (2 * repeat) * 100));
            $('div[data-model-pk=' + k + '] .result .draw').text(Math.round(result[3] / (2 * repeat) * 100));
        }
    });

});