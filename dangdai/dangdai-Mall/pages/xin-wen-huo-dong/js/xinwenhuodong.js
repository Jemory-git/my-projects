
require.config({//配置主页需要的模块
    paths: {
        "jquery": "../../index/js/jquery-3.2.1.min",
        "swiper": "../../index/js/swiper-3.4.2.jquery.min",
        "data": "../../data/list"
    }
});
require(['jquery', 'swiper', "data"], function ($, s, data) {


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
                    if (num[1] == 0) {
                        domToPage();
                    }
                }
            });
        });

        //获得hash  请求main中的内容
        var href = window.location.href,
            num = href.split("#");
        $("#center-content").load(as[num[2]][num[1]].dataset.ajaxHtml, function () {
            if (as[num[2]][num[1]].innerText === "当代活动") {
                $("#shop-img").show();
                $("#magazine-img").hide();

                slideShowEvent();

            } else {
                $("#shop-img").hide();
                $("#magazine-img").show();
                domToPage();
            }
        });

    });

    //生成swiper轮播图
    // function swiper() {
    //     var swiper = new s('.swiper-container', {
    //         loop: true,

    //         // 如果需要前进后退按钮
    //         nextButton: '.swiper-button-next',
    //         prevButton: '.swiper-button-prev',

    //         // 如果需要滚动条
    //         scrollbar: '.swiper-scrollbar',
    //     });
    // };

    //左侧边栏链接 设置跳转效果
    var urlDatas = $("[data-ajax-html]");
    urlDatas.on("click", function (e) {
        var that = this;
        $("#center-content").load(this.dataset.ajaxHtml, function (html) {
            if (that.innerText === "当代活动") {
                $("#shop-img").show();
                $("#magazine-img").hide();

                slideShowEvent();

            } else {
                $("#shop-img").hide();
                $("#magazine-img").show();
                domToPage();
            }
        });
    });

    //轮播图绑定事件
    function slideShowEvent() {
        var slideNumber = 0,
            allSlides = $(".swiper-slide"),
            textArr = ["优享家居 乐享端午", "时空金胶 恒世之美", "新鲜果蔬 健康长寿", "健康肌肤 美丽容颜"],
            textContainer = $(".text-info").find("span");
        $(allSlides[slideNumber]).addClass("show-opacity-item");
        $(".swiper-button-prev").on("click", function () {
            allSlides.removeClass("show-opacity-item");
            slideNumber = slideNumber <= 0 ? 3 : --slideNumber
            $(allSlides[slideNumber]).addClass("show-opacity-item");
            textContainer.html(textArr[slideNumber]);
        });
        $(".swiper-button-next").on("click", function () {
            allSlides.removeClass("show-opacity-item");
            slideNumber = slideNumber >= 3 ? 0 : ++slideNumber
            $(allSlides[slideNumber]).addClass("show-opacity-item");
            textContainer.html(textArr[slideNumber]);
        });
    };

    //改造数据
    // var list = Object.assign({},data.obj);
    var list = Array.from(data.obj),
        pageNumber = 1,
        pageBtns,
        newsListContainer = $("#center-content"),
        target;
    //设置事件委托
    newsListContainer.on("click", function (e) {
        //判断事件是不是turn-page-btn冒泡上来的
        target = e.target;
        classes = target.getAttribute("class") || " ";
        if (classes.search(/\bturn-page-btn\b/) >= 0) {
            var self = target.getAttribute("self");
            if (Number(self)) {
                pageNumber = self;
            } else if (self === "add") {
                pageNumber = pageNumber > 5 ? 1 : pageNumber + 1;
            } else if (self === "minus") {
                pageNumber = pageNumber < 2 ? 6 : pageNumber - 1;
            }
            domToPage();
        }
    });




    //生成新闻列表页面
    function domToPage() {
        dataToDom({
            container: "#news-list",
            template: "#template-newsItem"
        }, sliceData(pageNumber, list));

        pageBtns = $(".turn-page-btn");
        pageBtns.removeClass("current-page-identify");
        $(pageBtns[pageNumber]).addClass("current-page-identify");

    };

    //根据页数提取数据
    function sliceData(pageNumber, data) {
        return data.slice((pageNumber - 1) * 10, (pageNumber - 1) * 10 + 10);
    };


    //处理模板区域
    function dataToDom(idObj, data) {//定义处理模板，填入数据，输出DOM的方法
        $(idObj.container).html(
            Handlebars.compile(
                $(idObj.template).html()
            )(data)
        )
    };
});



