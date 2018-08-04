//主要用于设置页面样式
define(['jquery'], function ($) {
    function jsStyle() {
        var windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            headerHeight = $('header').outerHeight(true),
            mainHeight = windowHeight - headerHeight,
            searchInput = $('#search-input'),
            divDetail = $('#note-detail'),
            divNewNoteTextarea = $('#new-note-textarea'),
            spanPlaceholder = $('#placeholder'),
            divNewNote = $('#new-note'),
            divbody = $('.body'),
            coverDiv= $('#cover'),
            inputBoo, textareaHtml = '<p><br></p>';

        $('main').height(mainHeight);//设置main高度
        $('#detail-container').height(mainHeight);//设置detail高度
        divbody.height(windowHeight);//设置body高度
        coverDiv.on('input',function(){//简单设置个蒙层密码
            var passwords = this.textContent;
            if (passwords === 'open') {
                coverDiv.remove();
            }
        });

        $('#search-btn').on('click', function (e) {
            searchInput.css('padding-left', '10px').width('80%').trigger("click").focus();
        });
        searchInput.on('blur', function (e) {
            inputBoo = true;
            window.setTimeout(function () {
                if (inputBoo) {
                    searchInput[0].style.width = '0px';
                    searchInput[0].style.paddingLeft = '0px';
                }
            }, 200);
        });
        searchInput.on('focus', function (e) {
            inputBoo = false;
        });
        divNewNoteTextarea.on('focus', function () {//设置编辑区placeholder
            spanPlaceholder.hide();
            this.innerHTML = textareaHtml;//防xss
            textareaHtml = '<p><br></p>';
			if(windowWidth < 769){
                divNewNoteTextarea.css('margin', '50% auto 10%');
            }
        });
        divNewNoteTextarea.on('blur', function () {
            textareaHtml = this.innerHTML;//防xss
			divNewNoteTextarea.css('margin', 'auto');
            if (this.textContent == false) {
                spanPlaceholder.show();
            }
        });

        //绑定删除键事件，当两个输入区在按删除键时，判断是否需要添加p标签
        $(document).on('keyup', function (e) {
            var keyCode = e.which || e.keycode;
            if (divNewNoteTextarea.is(":focus") && keyCode == 8) {
                addPTag(divNewNoteTextarea);
            } else if (divDetail.is(":focus") && keyCode == 8) {
                addPTag(divDetail);
            }
        });

        function addPTag(textarea) {
            var restHtml = $(textarea).html().indexOf('<p');
            if (restHtml === -1) {
                var p = document.createElement("p"), br = document.createElement("br"),
                    range = window.getSelection().getRangeAt(0);
                p.appendChild(br);
                range.insertNode(p);
            }
        };

        function bindEntrustEvent(eventType, entrustedEl, entrustClassname, fn) {//事件类型  被委托元素  委托元素的class 执行的函数
            entrustedEl.on(eventType, function (e) {
                // e.preventDefault();
                var target = e.target;
                if (target.className.indexOf(entrustClassname) > -1) {
                    fn(target);
                }
            });
        };

        (function () {//解决移动端下拉刷新的问题
            if (windowWidth < 769) {
                var scrollerY = $('.scrollerY'), sct;
                scrollerY.on('scroll', function () {
                    sct = this.scrollTop;
                    if (sct < 2 && sct > -2) {
                        this.scrollTop = 1;
                    }
                });

                scrollerY[0].scrollTop = 1;

                bindEntrustEvent('click', divbody, 'second-category', function (target) {
                    if (target.parentNode.dataset.id.indexOf('o') === -1) {
                        scrollerY[1].scrollTop = 1;
                    }
                });
                bindEntrustEvent('click', divbody, 'icon-plus', function (target) {
                    scrollerY[2].scrollTop = 1;
                });
            }
        })();
    };

    return jsStyle;
});