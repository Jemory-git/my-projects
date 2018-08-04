
require.config({//配置主页需要的模块
    paths: {
        "jquery": "../../index/js/jquery-3.2.1.min",
        "mainGuanYuDangDai": "../../main/js/main-guan-yu-dang-dai"
    }
});
require(['jquery', 'mainGuanYuDangDai'], function ($, mgydd) {


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
                    if (num[2] == i) {
                        window.history.go(0);
                    }
                }
            });
        });

        //获得hash
        var href = window.location.href,
            num = href.split("#");
            
            $("#center-content").load(as[num[2]][num[1]].dataset.ajaxHtml);
    });




    //设置事件委托
    var main = $("#div-main-gydd");//main委托对象
    var containerEl = $("#center-content");//html 容器
    main.on("click", function (e) {
        if (e.target.hasAttribute("data-ajax-html")) {
            containerEl.load(e.target.dataset.ajaxHtml);
        } else { return; }
    });






    // //设置 header事件委托
    // var page = $("#header");//header委托对象
    // main.on("click",function (e){
    //     if (e.target.hasAttribute("data-ajax-html")) {
    //         containerEl.load(e.target.dataset.ajaxHtml);
    //     } else {return;}
    // });
});
