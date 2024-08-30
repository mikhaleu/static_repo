$(document).ready(function () {
    var menuData = {
        1: [{ name: "Каша манная", price: 3400 }, { name: "Яичница из двух яиц", price: 4500 }, { name: "Шведский стол", price: 18000 }, { name: "Плов", price: 9900}],
        2: [{ name: "Салат Цезарь", price: 8200 }, { name: "Суп-пюре из Брокколи", price: 7350}, { name: "Рагу из свинтны", price: 12200 }, { name: "Хлеб", price: 200}],
        3: [{ name: "Каша пшеная", price: 2300 }, { name: "Борщ", price: 3700 }, { name: "Отбивная из курицы", price: 13500 }, { name: "Пюре", price: 4350 }, { name: "Хлеб", price: 200}],
        4: [{ name: "Салат 'Загадка'", price: 50, displayPrice: 5650 }, { name: "Щи", price: 3950 }, { name: "Жаркое в горшочках", price: 14700 }, { name: "Хлеб", price: 200}],
        5: [{ name: "Салат Мистерия весны", price: 6400 }, { name: "Лагман", price: 6700 }, { name: "Бефстроганов", price: 12500 }, { name: "Капуста жареная", price: 5800 }, { name: "Хлеб", price: 200}],
        6: [{ name: "Каша кукурузная", price: 1900 }, { name: "Яичница с ветчиной", price: 6950 }, { name: "Суп 'всегда с тобой'", price: 5000 }, { name: "Хлеб", price: 200}],
        7: [{ name: "Цыпленой табака", price: 15000 }, { name: "Тыква тушеная со свининой", price: 11750 }, { name: "Рыбацкая уха", price: 11500 }, { name: "Хлеб", price: 200}]
    }

    function getSelectedKey() { return $('#days').find('option:selected').attr('key'); }

    var itemSelected = function () {
        $('#menu').children().hide();

        var key = getSelectedKey();
        var menuForDay = $("#menu>div[key=" + key + "]");
        if (menuForDay.length == 0) {
            menuForDay = $('<div>').appendTo('#menu').attr('key', key)
            for (var i in menuData[key]) {
                var menuItem = menuData[key][i]
                var checkbox = $('<input type="checkbox">');
                $.data(checkbox[0], "menuItem", menuItem);
                $('<div>')
				.addClass('menuPosition')
					.appendTo(menuForDay)
					.append(checkbox)
					.append($('<label>').text(menuItem.name + ' ' + (menuItem.displayPrice || menuItem.price) + ' р.'))
            }
        } else
            menuForDay.show();
        updateSum();
    };

    function menuItemClicked() {
        $.data($(this)[0], "menuItem").checked = $(this).is(':checked');
        updateSum();
    }

    function updateSum() {
        $('#orderSum').text(sumByMenuForDay(menuData[getSelectedKey()]));
    }

    function sumByMenuForDay(menuForDay) {
        var sum = 0;
        for (var i in menuForDay)
            if (menuForDay[i].checked)
                sum += menuForDay[i].price;
        return sum;
    }
    function makeOrder() {
        var menuForDay = menuData[getSelectedKey()];
        var selectedItems = [];
        for (var i in menuForDay)
            if (menuForDay[i].checked)
                selectedItems.push(menuForDay[i].name.toLowerCase());
        if (selectedItems.length == 0) {
            $('#validation').show();
            if (!$.browser.safari) return;
        }
        else
            $('#validation').hide();

        var sum = 0;
        for (var key in menuData)
            sum += sumByMenuForDay(menuData[key]);
        sum -= 10000;
        subtractAccount(sum);
        if (sum < 0) sum = 0;
        var text = $('#days').find('option:selected').text() + ", " + getSpoilDate() + ": " + selectedItems.join(', ') + ". Списано с личного счета " + Math.round(sum) + ' р.';
        $('<li>')
			.appendTo('#history')
			.text(text);
        resetValues();
    }

    function getSpoilDate(date) {
        return new Date(new Date().getTime() + 2000).toLocaleTimeString();
    }

    function resetValues() {
        for (var key in menuData)
            for (var i in menuData[key])
                if (key != '6' || i != 2) {
                    menuData[key][i].checked = false;
                    $($('div[key=' + key + ']').children()[i]).find('input').removeAttr('checked');
                }
        $('#orderSum').text('0');
    }

    function subtractAccount(sum) {
        var currentSum = Number($('#account').text().replace(' ', ''));
        $('#account').text((currentSum - sum).toFixed(2));
        if (currentSum - sum < 0) $('#isFull').show();
    }

    $('#days').change(itemSelected);
    itemSelected.apply($('#days'));
    $('#menu input[type=checkbox]').live('click', menuItemClicked);

    $('#makeOrder').click(makeOrder);
    if ($.browser.opera)
        $('#makeOrder').click(function () { alert(123); })

    $('#makeOrder').dblclick(function () { alert('Отлично!'); })

    setInterval(function () {
        $('#time').text(new Date().toLocaleTimeString());
    }, 1000);
});