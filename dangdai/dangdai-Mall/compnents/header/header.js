//定义header 部分的共用js
define(["jquery", function ($) {
    function h() {
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
                    }
                });
            });

            //获得hash
            var href = window.location.href,
                num = href.split("#");

            $("#center-content").load(as[num[2]][num[1]].dataset.ajaxHtml);
        });
    };
    console.log(h)
    return {
        a:h
    };
}]);