
require.config({//配置主页需要的模块
    paths: {
        "jquery": "../../index/js/jquery-3.2.1.min"
    }
});
require(['jquery'], function ($) {


    //载入公共头部和尾部
    var header = $("[data-ajax-header]");
    var footer = $("[data-ajax-footer]");
    header.load(header[0].dataset.ajaxHeader);
    footer.load(footer[0].dataset.ajaxFooter);

    $(document).ready(function () {
        //获取头部页面跳转的超链接
        var headerItems = $(".header-items");
        var as = [];
        var itemHrefs = [];
        for (var i = 0; i < headerItems.length; i++) {
            as[i] = $("[data-hash]", headerItems[i]);
            itemHrefs[i] = as[i][0].getAttribute("href");
        }
        //绑定事件委托，加入hash
        headerItems.each(function (i, c) {
            $(c).on("click", function (e) {
                var target = e.target;
                if (target.tagName == "A") {
                    target.setAttribute("href", itemHrefs[i] + "#" + target.dataset.hash + "#" + i);
                    // window.location.assign(itemHrefs[i] + "#" + target.dataset.hash + "#" + i);
                    if (num[2] || num[2] == i) {
                        window.history.go(0);
                    }
                }
            });
        });

        //获得hash
        var href = window.location.href,
            num;
        if (href.search(/\#/) > -1) {
            num = href.split("#");
            if (as[num[2]][num[1]].dataset.ajaxHtml) {
                $("#center-content").load(as[num[2]][num[1]].dataset.ajaxHtml);
            }
        }
    });

    //地图切换
    var tableBtns = $("#whln-tittle").find("span"),
        mapImg = $("#map-img"),
        imgUrl = [
            "img/map1.jpg",
            "img/map2.jpg",
            "img/wx.jpg"
        ];
    $(tableBtns[0]).addClass("active");
    tableBtns.on("click", function () {
        tableBtns.removeClass("active");
        $(this).addClass("active");

        var num = this.getAttribute("map");
        mapImg.attr("src", imgUrl[num]);
    });



});






