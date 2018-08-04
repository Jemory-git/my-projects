
require.config({//配置主页需要的模块
    paths: {
        "jquery": "../../index/js/jquery-3.2.1.min",
        "mainFuWuDaoHang": "../../main/js/main-fu-wu-dao-hang"
    }
});
require(['mainFuWuDaoHang'], function (mfwdh) {


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

    //生成box
    var boxContainer = document.getElementsByClassName("service-item-row")[0],
        box = document.getElementsByClassName("service-item-box"),
        ddblock = new mfwdh.Ddblock({
            container: boxContainer,//容器
            classname: "service-item-box",//box的class
            amount: 30,//创建box的总数
            offsetX: 2,//box 的左右间距
            offsetY: 2,//box 的上下间距
            messageArray: [
                "车场礼宾",
                "社团服务",
                "一站式退货活动",
                "24小时客服热线",
                "会员中心",
                "无障碍设施服务",
                "在线客服",
                "顾客休息区",
                "在线购物",
                "国际代购",
                "双语接待",
                "VIP服务",
                "VIP会员俱乐部",
                "停车服务"
            ],
            verticalCenter: true,//box 内容垂直居中
            emptyBoxOtherClass: "box-changeOpacity-animation",
            textBoxOtherClass: "text-box-background",
            dynamicStart: true,//开启自动循环排列
            dynamicInterval: 5000//设置timeout间隔
        });

    ddblock.createBox();
    ddblock.setPosition();

});






