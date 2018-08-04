//定义首页立方体js模块
define(["jquery"], function () {
    var cubeItem = $(".cube-item"),
        cubeRotate = $(".transform-jacket-outside"),
        cubeSentry = true,
        cubeInterval,//计时器的名字
        intervalFn,//计时器的回调函数
        interval;//计时器的时间
    return {
        cubeChanageStyle: function () {
            cubeItem.on("mouseenter", function (e) {
                cubeSentry = false;
                $(this).removeClass("opacity-animation");
            });
            cubeItem.on("mouseleave", function (e) {
                cubeSentry = true;
                $(this).addClass("opacity-animation");
            });
        },
        cubeRandomTransform: function (i) {
            interval = i || 3000;
            intervalFn = function () {
                cubeItem.removeAttr("style");
                var randomNumber = Math.floor(Math.random() * 6);
                if (cubeSentry) {
                    if (randomNumber < 4) {
                        cubeItem[randomNumber].style.transform = "rotateX(" + (randomNumber * 90) + "deg) translateZ(180px)";
                    } else if (randomNumber === 4) {
                        cubeItem[randomNumber].style.transform = "rotateY(90deg) translateZ(180px)";
                    } else if (randomNumber === 5) {
                        cubeItem[randomNumber].style.transform = "rotateY(270deg) translateZ(180px)";
                    }
                }
            };
            cubeInterval = setInterval(intervalFn, interval);
            cubeItem.on("mouseenter", function (e) {
                clearInterval(cubeInterval);
                cubeItem.removeAttr("style");
            });
            cubeItem.on("mouseleave", function (e) {
                cubeInterval = setInterval(intervalFn, interval);
            });
        },
        cubeRotateFn: function (v, axis) {
            v = v || 10;
            axis = axis || "y";
            if (cubeSentry) {
                cubeRotate.addClass("cube-rotate-" + axis).css({
                    "animation-duration": v + "s"
                });
            }
            cubeItem.on("mouseenter", function (e) {
                cubeRotate.addClass("animation-play-state-pause");
            });
            cubeItem.on("mouseleave", function (e) {
                cubeRotate.removeClass("animation-play-state-pause");
            });
        }
    };
});