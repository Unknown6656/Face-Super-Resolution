
$(document).ready(function () {
    var val = 0;

    setInterval(function () {
        val += 0.1;
        val %= 100;

        var valstr = "" + Math.round(val);
        var progr = $('div#main-view progress');

        $('span#progress').text(valstr);
        progr.attr('descr', valstr);
        progr.attr('value', val);
    }, 10);

    $('.menu_item').click(function () {
        var _this = $(this);
        var submenu = _this.find('.sub_menu');
    
        $('.menu_item').each(function () {
            if (_this != $(this))
                togglesubmenu($(this), true);
        });
    
        togglesubmenu(_this);
    });
    $('.sub_menu_item, #inner, #footer').click(function () {
        setTimeout(function() {
            $('.menu_item').each(function () {
                togglesubmenu($(this), true);
            });
        }, 30);
    });
    $('div#gallery').html(Array(200).join('<div class="image"><canvas></canvas></div>\n'));
    $('div#gallery .image > canvas').each(function() {
        draw_random($(this));
    });
    $('div#toggle').click(function () {
        toggleside();
    });
    $('div#gallery .image').click(function() {
        var curr = $(this);
    
        $('div#gallery .image').each(function() {
            $(this).removeClass('selected');
        });
    
        curr.addClass('selected')
    
        $('div#gallery .image.selected')[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    
        var cvs1 = $('#p1 canvas')[0];
        var cvs2 = $('#p2 canvas')[0];
        var ctx1 = cvs1.getContext('2d');
        var ctx2 = cvs2.getContext('2d');

        ctx1.drawImage(curr.find('canvas')[0], 0, 0);
        ctx2.drawImage(cvs1, 0, 0);

        Filter([
            [-1, -1, -1],
            [-1, 9, -1],
            [-1, -1, -1]
        ]).canvas(cvs2);

        var b = 0.01;

        Filter([
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b, b]
        ]).canvas(cvs1);

        toggleside(true);
    });
});


function togglesubmenu(menu, forceclose) {
    var submenu = menu.find('.sub_menu');

    if (forceclose == undefined)
        forceclose = false;

    if (submenu.hasClass('open') || forceclose)
        submenu.removeClass('open');
    else if (!forceclose)
        submenu.addClass('open');
}

function toggleside(forceclose) {
    var panel = $('div#side_panel');
    var mainv = $('div#main-view');

    if (forceclose == undefined)
        forceclose = false;

    if (panel.hasClass('open') || forceclose)
        panel.removeClass('open');
    else if (!forceclose)
        panel.addClass('open');

    if (panel.hasClass('open'))
        mainv.addClass('unfocused');
    else
        mainv.removeClass('unfocused');
    
    setTimeout(function() {
        try {
            $('div#gallery .image.selected')[0].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } catch (e) {
        }
    }, 300);
}

function draw_random(target) {
    var canvas = target[0];
    var grain = 8.0;
    var blockout = Math.random();
    var w = canvas.width;
    var h = canvas.width;

    colorArray = [];

    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, w, h);

        function randomRGB(min, max)
        {
            var min = Math.ceil(min);
            var max = Math.floor(max);

            for (var i = 0; i < 3; i++)
                colorArray.push(Math.floor(Math.random() * (max - min)) + min);
        }

        function pokeOut()
        {
            randomRGB(80, 200);

            var posX = 0;
            var posY = 0;
            var startFillRed = colorArray[0];
            var startFillGreen = colorArray[1];
            var startFillBlue = colorArray[2];

            ctx.fillStyle = `rgb(${startFillRed}, ${startFillGreen}, ${startFillBlue})`;

            for (var y = 0; y < grain; y++) {
                for (var x = 0; x < grain; x++) {
                    if (blockout < .3) {
                        ctx.fillRect(posX, posY, w / grain, h / grain);
                        ctx.fillRect(w - posX - w / grain, posY, w / grain, h / grain);
                        
                        posX += w / grain;
                    } else {
                        --startFillRed;
                        ++startFillGreen;
                        ++startFillBlue;

                        ctx.fillStyle = `rgb(${startFillRed}, ${startFillGreen}, ${startFillBlue})`;
                        posX += w / grain;
                    }

                    blockout = Math.random();
                }

                posY += h / grain;
                posX = 0;
            }
        }

        pokeOut();
    }
}
