//js创建dom元素模块
define(['jquery'], function ($) {
    var createFn = {};
    createFn.createLi = function (contentArr, parentId, className, iconClass, liClass) {//列表各项内容构成的数组  放置列表的元素  列表项的class
        if (contentArr.length === 0) { return; }
        var container = $(parentId), that = this;
        contentArr.forEach(function (c, i) {
            var li = that.createElement('li'),
                span = that.createElement('span'),
                liText = document.createTextNode(c.name),
                p = that.createElement('p');

            that.createAttr('data-id', c.id, li);
            span.className = iconClass + ' ' + className;
            p.appendChild(liText);
            p.className = className;
            li.className = liClass;
            li.appendChild(span);
            li.appendChild(p);
            container.append(li);
        });
    };

    createFn.createUlList = function (contentArr, parent, className, iconClass, divClass, dataset) {//列表各项内容构成的数组  放置列表的元素  列表项的class 图标class 最后是div要附加的dataset对象
        if (contentArr.length === 0) { return; }
        if (typeof(contentArr[0]) === 'string') {//显示一级目录用
            var ul = this.createElement('ul'), that = this;
            contentArr.forEach(function (c, i) {
                var li = that.createElement('li'),
                    span = that.createElement('span'),
                    liText = document.createTextNode(c),
                    p = that.createElement('p');
                span.className = iconClass + ' ' + className;
                p.appendChild(liText);
                p.className = className;
                li.appendChild(span);
                li.appendChild(p);
                if (divClass) {
                    var div = that.createElement('div');
                    div.className = divClass;
                    if (dataset && typeof(dataset) === 'object') {
                        var datasetProperty = Object.keys(dataset);
                        datasetProperty.forEach(function(c,i){
                            that.createAttr('data-' + c, dataset[c], div);
                        });
                    }
                    li.appendChild(div);
                }
                ul.appendChild(li);
            });
            $(parent).html(ul);

        } else {//显示次级目录用
            var ul = this.createElement('ul'), that = this;
            contentArr.forEach(function (c, i) {
                var li = that.createElement('li'),
                    span = that.createElement('span'),
                    liText = document.createTextNode(c.foldername),
                    p = that.createElement('p');
                span.className = iconClass + ' ' + className;
                p.appendChild(liText);
                p.className = className;
                li.appendChild(span);
                li.appendChild(p);
                if (divClass) {
                    var div = that.createElement('div');
                    div.className = divClass;
                    that.createAttr('data-id', c.folderId, div);
                    that.createAttr('data-position', c.position, div);
                    if (dataset && typeof(dataset) === 'object') {
                        var datasetProperty = Object.keys(dataset);
                        datasetProperty.forEach(function(c,i){
                            that.createAttr('data-' + c, dataset[c], div);
                        });
                    }
                    li.appendChild(div);
                }
                ul.appendChild(li);
            });
            $(parent).append(ul);
        }

        
    };

    createFn.createAttr = function (attrName, attrValue, parasitifer) {//创建的属性名  属性值  设置此属性的元素
        var a = document.createAttribute(attrName);
        a.value = attrValue;
        parasitifer.setAttributeNode(a);
    };

    createFn.createElement = function (e) {//创建元素
        return document.createElement(e);
    };

    return createFn;
});