//弹出框模块
define([
    'create-element'
], function (createFn) {
    
    var callBackFn = function(){}, popBox = {}, body = document.getElementsByTagName('body')[0];
    function outerDiv() {
        var div = document.createElement('div');
        div.id = 'pop-box-outer-div';
        createFn.createAttr('style', 'transition:all 1s;opacity:1;position:fixed;height:100%;width:100%;top:0;left:0;display:flex;justify-content:center;align-content:center;', div);
        return div;
    };

    function innerSpan(classStr, styleStr) {
        var span = document.createElement('span');
        span.className = classStr;
        createFn.createAttr('style', styleStr, span);

        return span;
    };

    function bindEntrustEvent(eventType, entrustedEl, entrustClassname, fn) {//事件类型  被委托元素  委托元素的class 执行的函数
        entrustedEl.addEventListener(eventType, function (e) {
            // e.preventDefault();
            var target = e.target;
            if (target.className.indexOf(entrustClassname) > -1) {
                fn(target);
            }
        }, false);
    };

    bindEntrustEvent('click', body, 'pop-box-confirm-btn', function (target) {
        popBox.removeBox(true);
        callBackFn();
    });
    bindEntrustEvent('click', body, 'pop-box-cancel-btn', function (target) {
        popBox.removeBox(true);
    });

    popBox.removeBox = function (boo) {//boo 为false 则渐隐  为true则立马消失
        var div = document.getElementById('pop-box-outer-div');
        if (div.id === 'pop-box-outer-div') {
            if (boo) {
                body.removeChild(div);
            } else {
                div.style.opacity = '0';
                window.setTimeout(function () {
                    body.removeChild(div);
                }, 500);
            }
        }
    };

    popBox.loading = function () {
        var span = innerSpan('icon-spinner icon-spin icon-4x', 'height:max-content;position:absolute;top:50%;color:#cdd6c4'),
            div = outerDiv();
        div.appendChild(span);
        body.appendChild(div);
    };

    popBox.alert = function (message, timeout) {
        var span = innerSpan('', 'letter-spacing:5px;padding:10px 20px;color:#000;font-size:1.4rem;background-color:#61655d;border-radius:5px;align-self:center;'),
            div = outerDiv(),
            innerText = document.createTextNode(message);
        span.appendChild(innerText);
        div.appendChild(span);
        body.appendChild(div);
        if (timeout) {
            window.setTimeout(function () {
                popBox.removeBox();
            }, timeout);
        }
    };

    popBox.confirm = function (message, fn) {
        var span = innerSpan('', 'position:relative;letter-spacing:5px;padding:10px 20px;color:#000;font-size:1.4rem;background-color:#61655d;border-radius:5px;align-self:center;'),
            div = outerDiv(),
            messageSpan = innerSpan('', 'display:block;padding:5px;'),
            confirmSpan = innerSpan('pop-box-confirm-btn', 'width:50%;padding:5px;cursor:pointer;position:absolute;left:0;background-color:#ffe32a;text-align:center;'),
            cancelSpan = innerSpan('pop-box-cancel-btn', 'width:50%;padding:5px;cursor:pointer;position:absolute;right:0;background-color:#6cd40e;text-align:center;'),
            innerText = document.createTextNode(message),
            confirmText = document.createTextNode('确认'),
            cancelText = document.createTextNode('取消');

        confirmSpan.id = 'pop-box-confirm-span-btn';
        cancelSpan.id = 'pop-box-cancel-span-btn';

        cancelSpan.appendChild(cancelText);
        confirmSpan.appendChild(confirmText);
        messageSpan.appendChild(innerText);

        span.appendChild(messageSpan);
        span.appendChild(confirmSpan);
        span.appendChild(cancelSpan);

        div.appendChild(span);
        body.appendChild(div);

        callBackFn = fn;
    };

    return popBox;
});