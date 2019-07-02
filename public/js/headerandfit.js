//header的动作
var navlis = $(".navbar li");
$.each(navlis, function (i) {
    $(this).on("mouseenter", function () {
        switch (i) {
            case 1:
            case 2:
            case 3:
                $(".navbar-extend").show();
                break;
            default:
                break;
        }
    });

});

$(".headnav").on("mouseleave", function () {
    $(".navbar-extend").hide();
});

// $(".search-btn").on("mouseenter", function () {
//     $("#search").animate({
//         "width": "200px",
//         "padding": "0px 10px"
//     }, 100);
// });
// $(".search-btn").on("mouseleave", function () {
//     $("#search").animate({
//         "width": "0px",
//         "padding": "0px"
//     }, 100);
// });

$(".user").on("mouseenter", function () {
    $(".user-panel").fadeIn(200);
});
$(".user").on("mouseleave", function () {
    $(".user-panel").fadeOut(200);
});

$(".shoppingcart").on("mouseenter", function () {
    $(".shoppingcart-panel").fadeIn(200);
});
$(".shoppingcart").on("mouseleave", function () {
    $(".shoppingcart-panel").fadeOut(200);
});

// //屏幕适配
// window.onresize = function () {
//     var sw = window.innerWidth;
//     if (sw < 1100) {
//         $(".container").css({
//             "width": "90%"
//         });
//     } else {
//         $(".container").css({
//             "width": "1100px"
//         });
//     }

//     var nav = document.getElementsByClassName('navbar');
//     if (sw < 736) {
//         for (var i = 0; i < nav[0].children.length; i++) {
//             nav[0].children[i].style.display = 'none';
//             nav[0].children[0].style.display = 'inline-block';
//             nav[0].children[5].style.display = 'inline-block';
//             nav[0].children[6].style.display = 'inline-block';
//         }
//     } else {
//         for (var i = 0; i < nav[0].children.length; i++) {
//             nav[0].children[i].style.display = 'inline-block';
//         }
//     }
// }

$("#back2top").click(function () {
    $("html,body").animate({ scrollTop: "0px" }, 400);
});