
require.config({//配置主页需要的模块
    paths: {
        "cube": "compnents/cube/js/cube",
        "jquery": "index/js/jquery-3.2.1.min"
    }
});
require(['jquery','cube'], function ($,cube) {//执行立方体模块的方法
    cube.cubeChanageStyle();//变换透明度
    cube.cubeRandomTransform(3000);//定时器
    cube.cubeRotateFn(10,"y");//执行此方法让立方体旋转起来

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
});
