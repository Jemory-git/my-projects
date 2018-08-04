//定义服务导航页面的main区域js模块
define(["jquery"], function () {
    function Ddblock(config) {
        this.amount = config.amount || 5;
        this.messageArray = config.messageArray || [];
        this.startPosition = config.startPosition || { x: 0, y: 0 };
        this.classname = config.classname;
        this.container = config.container;
        this.offsetX = config.offsetX || 0;
        this.offsetY = config.offsetY || 0;
        this.verticalCenter = config.verticalCenter || false;
        this.dynamicStart = config.dynamicStart || true;
        this.dynamicInterval = config.dynamicInterval || 3000;
        this.otherClass = config.otherClass || "";
        this.textBoxOtherClass = config.textBoxOtherClass || "";
        this.emptyBoxOtherClass = config.emptyBoxOtherClass || "";
        //保存自身位置的数组
        this.xNowPosition = [];
        this.yNowPosition = [];
        this.xNextPosition = [];
        this.yNextPosition = [];
        //保存本实例下所有的box
        this.boxs = [];
    };

    Ddblock.prototype.createBox = function () {
        function createAttr(attrName, attrValue, parasitifer) {
            var a = document.createAttribute(attrName);
            a.value = attrValue;
            parasitifer.setAttributeNode(a);
        };
        var emptyBox = [];
        for (var i = 0; i < this.amount; i++) {
            var div = document.createElement("div");

            //添加 class
            if (this.classname && this.container) {
                createAttr("class", this.classname + " " + this.otherClass, div);
            } else { console.log("请定义并传入classname参数"); }

            //添加绝对定位
            createAttr("style", "position: absolute;", div);

            //添加 文本
            if (this.messageArray[i]) {//有文本的box
                createAttr("class", this.classname + " " + this.otherClass + " " + this.textBoxOtherClass, div);
                var text = document.createTextNode(this.messageArray[i]);
                if (this.verticalCenter) {//如果设置了垂直居中（多用于多行文本）
                    var span = document.createElement("span");
                    span.appendChild(text);
                    div.appendChild(span);
                    createAttr("style", "display: flex;flex-direction: column;justify-content: center;", div);
                } else {
                    div.appendChild(text);
                }
            } else {//没有文本的box
                var durationTime = Math.random() * 3 + 2;
                createAttr("style", "animation-duration: " + durationTime + "s", div);
                createAttr("class", this.classname + " " + this.otherClass + " " + this.emptyBoxOtherClass, div);
            }
            this.container.appendChild(div);
        }
        for (var i = 0; i < this.amount; i++) {//初始化位置数组
            this.xNowPosition[i] = 0;
            this.yNowPosition[i] = 0;
        }
    };

    Ddblock.prototype.getBoxSizeInfo = function () {
        var containerEl = $(this.container),
            boxs = $("." + this.classname, containerEl);
        this.boxs = boxs.slice();
        //设置容器为定位元素
        var containerPosition = containerEl.css("position");
        if (containerPosition === "static") {
            this.container.style.position = "relative";
        }
        //获取box的大小
        var containerWidth = containerEl.width(),
            containerHeight = containerEl.height(),
            boxWidth = boxs[0].offsetWidth + this.offsetX,
            boxHeight = boxs[0].offsetHeight + this.offsetY;
        return {
            containerWidth: containerWidth,
            containerHeight: containerHeight,
            boxWidth: boxWidth,
            boxHeight: boxHeight
        }
    };

    Ddblock.prototype.setPosition = function () {
        var sizeInfo = this.getBoxSizeInfo(),
            randonRangeX = Math.floor(sizeInfo.containerWidth / sizeInfo.boxWidth),
            randonRangeY = Math.floor(sizeInfo.containerHeight / sizeInfo.boxHeight);
        //定义获取随机数
        function randomCoefficient() {
            var randomCoefficientX = Math.floor(Math.random() * randonRangeX);
            var randomCoefficientY = Math.floor(Math.random() * randonRangeY);
            return {
                x: randomCoefficientX,
                y: randomCoefficientY
            }
        };

        //保存系数信息
        var xPre = [], yPre = [], that = this;

        //以下注释代码日后优化性能时需要用
        // var xArr = [];
        // var yArr = [];
        // for (var i = 0; i <= randonRangeX; i++) {
        //     xArr[i] = i;
        // }
        // for (var i = 0; i <= randonRangeY; i++) {
        //     yArr[i] = i;
        // }
        // xArr.splice(randomCoefficientX,1);

        //遍历box，设置定位
        this.boxs.each(function (i) {
            //获得随机系数
            var coef = randomCoefficient();
            function isEqualThan() {
                for (var i = 0; i < xPre.length; i++) {
                    // console.log("x..." + i, xPre[i] === coef.x, "y..." + i, yPre[i] === coef.y);日后有用
                    if (xPre[i] === coef.x && yPre[i] === coef.y) {
                        return true;
                    }
                }
            };

            //判断获得的一组系数与之前的是否相等，如果相等就重新取值
            while (isEqualThan()) {
                coef = randomCoefficient();
            }

            //保存系数
            xPre.unshift(coef.x);
            yPre.unshift(coef.y);
            //保存位置
            that.xNextPosition[i] = coef.x * sizeInfo.boxWidth;
            that.yNextPosition[i] = coef.y * sizeInfo.boxHeight;
        });

        (function () {
            var left, top,
                xDiffValue,
                yDiffValue,
                boxInterval;
            boxInterval = window.setInterval(function () {//js搞了四个小时的动画，搞完才测试出transition三分钟搞定！我草！
                for (var i = 0; i < that.amount; i++) {//那我也不换transition了，不然白写了...
                    xDiffValue = that.xNowPosition[i] - that.xNextPosition[i];
                    yDiffValue = that.yNowPosition[i] - that.yNextPosition[i];

                    left = that.xNowPosition[i] - xDiffValue * 0.1;
                    that.xNowPosition[i] = left;
                    top = that.yNowPosition[i] - yDiffValue * 0.1;
                    that.yNowPosition[i] = top;

                    that.boxs[i].style.left = left + "px";
                    that.boxs[i].style.top = top + "px";

                }
                if ((xDiffValue < 0.5 && xDiffValue > -0.5) && (yDiffValue < 0.5 && yDiffValue > -0.5)) {
                    window.clearInterval(boxInterval);
                    //保存所有当前位置信息
                    that.xNowPosition = Array.from(that.xNextPosition);
                    that.yNowPosition = Array.from(that.yNextPosition);
                }
            }, 20);
        })();//自执行匿名函数结束

        if (this.dynamicStart) {//设置定时器变换位置
            window.setTimeout(this.setPosition.bind(this), this.dynamicInterval);
        }
    };
    return {
        Ddblock: Ddblock
    }
});