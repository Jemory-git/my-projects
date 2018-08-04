//页面功能
require([
    'jquery',
    'index',
    'create-element',
    'showfiles',
    'objectEqual',
    'pop-up-box',
    'ajax'
], function ($, indexjs, createFn, showFilesObj, objEq, popupBox, ajax) {
    indexjs();
    var data, sonCategoryData, allFolders = [], allFiles = [], backArr = [], backNumber = 1, showNumber, starArr = [],
        windowWidth = $(window).width(), justnowPushedFolder,
        saveBtn = $('#save-btn'),
        divDetail = $('#note-detail'),
        noteNameSpan = $('#note-name-span'),
        noteDateSpan = $('#note-date-span'),
        detailContainer = $('#detail-container'),
        gFirstCategory = $('#first-category'),
        starFileBtn = $('#star-btn'),
        divNewNote = $('#new-note'),
        shutdownBtn = $('#shutdown-btn'),
        openBoo = true, execBoo = true, bindEventBoo = true, saveBoo = false, detailHtml,
        shutdownNewNoteBtn = $('#shutdown-new-note-btn'),
        editBtn = $('#edit-btn'),
        showFilesFn = showFilesObj.showFiles,
        showingArr, pathDestinationObj, savePath,//showingArr用于删除文件功能
        showFolderTree = $('#show-folder-tree'),
        selectPathBtn = $('#select-path-btn'),
        confirmBtn = $('#path-confirm-btn'),
        abandonNewNote = $('#abandon-new-note-btn'),
        folderTreeContainer = $('#folder-tree-container'),
        folderTreeFirst = $('#folder-tree-first'),
        showPath = $('#show-path'),
        pathInput = $('#path-input'),
        newNoteName = $('#note-name-iput'),
        searchBtn = $('#search-btn'),
        searchInput = $('#search-input'),
        newNoteTextarea = $('#new-note-textarea');
    getData(getdata);//拉取所有笔记数据

    //新建笔记功能
    $('#new-note-btn').on('click', function () {
        showEditArea();
        if (bindEventBoo) {
            selectPathBtn.on('click', function () {
                showfolderTree();
            });
            bindEventBoo = false;
        }
    });

    //在选择目录界面，点击确定按钮，关闭弹出框
    confirmBtn.on('click', function () {
        folderTreeContainer.css('transform', 'scaleX(0)');
        if (savePath === undefined || savePath === '未分组') {//如果没有点击文件图标，则需默认路径为‘/’，同时查找添加新笔记的数组
            savePath = '未分组';
            pathInput.text('/未分组');

            var pathResult = matchPath(savePath);//并保存数组
            pathDestinationObj = pathResult.destination;//folder对象
        } else {
            pathInput.text(showPath.text());
        }
    });

    function gatherFolders(arr) {//从给定的文件数组中，收集文件夹对象，并返回
        var folderArr = [], len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i].type === 'folder') {
                folderArr.push(arr[i]);
            }
        }
        return folderArr;
    };
    bindEntrustEvent('click', '#show-folder-tree', 'cover-div', function (target) {//选择保存路径时，生成二级及其他文件夹
        var divNumber = target.dataset.number;
        if (divNumber === '1') {
            var pText = target.previousSibling.textContent, folderArr, sonFolders = data[pText];//获得子文件数组
            savePath = pText;

            folderArr = gatherFolders(sonFolders);//收集文件夹对象
            clearFolderLine(divNumber);//清除文件夹，之后在展示新的
            if (folderArr.length > 0) {
                var result = createFolderLine(divNumber);
                createFolderUl(folderArr, result.folderArr[divNumber], result.folderArr[divNumber - 1], target, { number: result.number });
            } else {
                openIcon(target, $('#folder-tree-first'));
            }
        } else if (divNumber > 1) {
            savePath = target.dataset.position;
            var folderId = target.dataset.id, filesProperty, folderArr;
            allFolders.forEach(function (c, i) {//匹配点击的文件夹
                if (c.folderId === folderId) {
                    filesProperty = c.files;
                    folderArr = gatherFolders(filesProperty);//收集文件夹对象
                }
            });
            clearFolderLine(divNumber);//清除文件夹，之后再展示新的
            if (folderArr.length > 0) {
                var result = createFolderLine(divNumber);
                createFolderUl(folderArr, result.folderArr[divNumber], result.folderArr[divNumber - 1], target, { number: result.number });
            } else {
                openIcon(target, $('.folder-line')[divNumber - 1]);
            }
        }

        var pathResult = matchPath(savePath),//展示路径选择,并保存数组
            pathString = pathResult.pathStr;
        pathDestinationObj = pathResult.destination;//folder对象
        showPath.text(pathString);
    });

    //保存新建笔记的功能
    $('#save-new-note-btn').on('click', function () {
        newNoteTextarea.focus();//触发编辑区focus事件，防xss
        if (!pathInput.text()) {
            popupBox.alert('请选择保存路径!', 1000);
            newNoteTextarea.blur();//缩回移动端键盘
            return;
        }
        var newFileObj = {}, time = new Date(),
            month = time.getMonth() + 1,
            date = time.getDate(),
            hours = time.getHours(),
            minutes = time.getMinutes();//创建笔记对象，可以交给后台做，前台把name detail 路径 传过去

        var nameInputValue = newNoteName[0].value;
        if (!nameInputValue) {
            popupBox.alert('请填写笔记名字!', 1000);
            newNoteTextarea.blur();//缩回移动端键盘
            return;
        } else if (nameInputValue.search(/[\,\[\]\'\"\<\>]{*}/) > -1) {
            popupBox.alert('请填写合格的名字!', 1000);
            newNoteTextarea.blur();//缩回移动端键盘
            return;
        }
        newFileObj.filename = nameInputValue;//检测合格就赋值
        var textareaHtml = newNoteTextarea.html(), textareaText = newNoteTextarea.text();
        if (!textareaText) {
            popupBox.alert('请填写笔记内容!', 1000);
            newNoteTextarea.blur();//缩回移动端键盘
            return;
        }

        newFileObj.detail = textareaHtml;//检测合格就赋值
        newFileObj.ctime = dateAdd0(hours) + ":" + dateAdd0(minutes);
        newFileObj.cdate = time.getFullYear() + '/' + dateAdd0(month) + '/' + dateAdd0(date);
        newFileObj.fileId = "f" + time.getTime();
        newFileObj.type = 'file';

        if (Array.isArray(pathDestinationObj)) {//如果是数组，就是一级目录，否则就是次级目录对象
            newFileObj.fileFather = savePath;
            newFileObj.position = [savePath + '[' + pathDestinationObj.length + ']'];
            pathDestinationObj.push(newFileObj);//修改客户端的笔记数据
            allFiles.push(newFileObj);//添加新笔记到allFiles数组
            justnowPushedFolder = pathDestinationObj;//保存新创建文件的文件夹
        } else {
            newFileObj.fileFather = pathDestinationObj.folderId;
            var copyPositionArr = Array.from(pathDestinationObj.position), newPosition = 'files[' + pathDestinationObj.files.length + ']';
            copyPositionArr.push(newPosition);
            newFileObj.position = copyPositionArr;
            pathDestinationObj.files.push(newFileObj);//修改客户端的笔记数据
            allFiles.push(newFileObj);//添加新笔记到allFiles数组
            justnowPushedFolder = pathDestinationObj.files;//保存新创建文件的文件夹
        }

        //向服务器发送 newFileObj 和 保存路径
        var saveNewFileData = {
            newFileObj: newFileObj,
            saveAddress: savePath
        }, header = {
            contentType: 'application/json'
        };

        ajax.post('photo-server/server.js?type=newnote', JSON.stringify(saveNewFileData), function () {//发送保存请求
            shutdownEditeAreaFn();//关闭编辑区
            clearEditeArea();//清空编辑区
            newNoteTextarea.blur();//缩回移动端键盘,这句必须放在清空编辑区后面
            popupBox.alert('笔记保存成功!', 1000);
            showingArr = showFilesFn(justnowPushedFolder);//打开刚新建笔记的文件夹, 
            backArrPush();//并push进后退数组
        }, header);
    });

    //放弃新建笔记，并清除编辑区的内容
    abandonNewNote.on('click', function () {
        var noteName = newNoteName[0].value,
            path = pathInput.text(),
            noteDetail = newNoteTextarea.text();
        if (path || noteName || noteDetail) {
            popupBox.confirm('确认清空此次编辑内容？', function () {
                clearEditeArea();
                shutdownEditeAreaFn();
            });
        } else {
            shutdownEditeAreaFn();
        }

    });

    function matchPath(path) {
        var pathArr = path.split(','), pathStr = '/', target = data;
        if (path.indexOf('[') > -1) {
            pathArr.forEach(function (c, i) {//获取目标位置
                var len = c.length,
                    dividePoint = c.lastIndexOf('['),
                    objPosition = c.substring(0, dividePoint),
                    arrPosition = c.substr(dividePoint).match(/\d+/)[0];
                target = target[objPosition][arrPosition];
                if (i === 0) {
                    pathStr = pathStr + objPosition + '/' + target.foldername;
                } else {
                    pathStr = pathStr + '/' + target.foldername;
                }
            });
            return {
                pathStr: pathStr,
                destination: target
            };
        } else {
            if (path === '/') {
                pathStr = path;
                return {
                    pathStr: pathStr,
                    destination: target.未分组
                };
            } else {
                pathStr = pathStr + path;
                return {
                    pathStr: pathStr,
                    destination: target[path]
                };
            }

        }
    };


    function showEditArea() {//显示编辑区
        if (openBoo) {
            divNewNote.show();
            window.setTimeout(function () {
                divNewNote[0].style.top = "0";
            }, 100);
            openBoo = false;
        } else {
            popupBox.alert('您需要先完成编辑，再新建笔记!', 1000);
        }


    };

    //删除笔记的功能
    $('#remove-btn').on('click', function () {
        popupBox.confirm('确定删除笔记吗？', function () {
            var position = divDetail[0].dataset.position,
                id = divDetail[0].dataset.id,
                url = 'photo-server/server.js?type=delete&position=' + position;
            ajax.get(url, function () {//发送删除请求
                popupBox.alert('笔记删除成功!', 1000);
            });
            showingArr.forEach(function (c, i) {
                if (c.fileId === id) {
                    c.showBoo = 'false';//让文件不显示，模拟删除，待修正, 不过这种方法有利于添加恢复文件的功能
                }
            });
            showingArr = showFilesFn(showingArr);
            divDetail.attr('contenteditable', 'false').css('background-color', '#6b58ff');//移除编辑功能
            shutDownNote();
            openBoo = true;
        });
    });

    //修改笔记功能
    editBtn.on('click', function () {
        divDetail.attr('contenteditable', 'true').css('background-color', '#fff').focus();
        openBoo = false;
        saveBoo = true;
    });

    //修改笔记防xss
    divDetail.on('focus', function () {
        divDetail.html(detailHtml);//防xss
		if(windowWidth < 769){
			divDetail.css('margin', '50% auto 10%');
		}
    });
    divDetail.on('blur', function () {
        detailHtml = divDetail.html();//防xss
		if(windowWidth < 769){
			divDetail.css('margin', 'auto');
		}
    });

    //保存编辑功能
    saveBtn.on('click', function () {
        if (!saveBoo) {
            popupBox.alert('笔记未更改!', 1000);
            return;
        }
        
        if (divDetail.text()) {
            divDetail.focus();//防xss
            var note = divDetail.html(),
                position = divDetail[0].dataset.position.split(','),//命名文件夹禁用','号，禁用‘[’和‘]’
                time = new Date(),
                mtime = dateAdd0(time.getHours()) + ":" + dateAdd0(time.getMinutes()),
                mdate = time.getFullYear() + '/' + dateAdd0(time.getMonth() + 1) + '/' + dateAdd0(time.getDate()),
                target = data,
                header = {
                    contentType: 'application/json'
                },
                ajaxObj = {
                    position: position,
                    detail: note,
                    mtime: mtime,
                    mdate: mdate
                },
                ajaxJson = JSON.stringify(ajaxObj);
            noteDateSpan.text(ajaxObj.mdate + ' ' + ajaxObj.mtime);//修改显示的笔记mtime
            divDetail.attr('contenteditable', 'false').css('background-color', '#6b58ff');//移除编辑功能

            position.forEach(function (c, i) {//获取目标位置
                var len = c.length,
                    dividePoint = c.lastIndexOf('['),
                    objPosition = c.substring(0, dividePoint),
                    arrPosition = c.substr(dividePoint).match(/\d+/)[0];
                target = target[objPosition][arrPosition];
            });
            target.detail = note;//修改客户端的笔记数据

            ajax.post('photo-server/server.js?type=save', ajaxJson, function () {//发送保存请求
                divDetail.blur();//缩回移动端键盘
                popupBox.alert('笔记保存成功!', 1000);
            }, header);

            openBoo = true;
            saveBoo = false;
        } else {
            popupBox.alert('需要填写笔记内容!', 1000);
        }
    });


    //关闭功能
    shutdownBtn.on('click', function () {//关闭打开的笔记
        if (openBoo) {
            shutDownNote();
        } else {
            popupBox.alert('您需要先保存编辑，再关闭笔记!', 1000);
        }
    });
    shutdownNewNoteBtn.on('click', function () {//关闭新建的笔记
        shutdownEditeAreaFn();
    });
    function shutdownEditeAreaFn() {
        divNewNote[0].style.top = "100%";
        window.setTimeout(function () {
            divNewNote.hide();
        }, 300);
        openBoo = true;
    };
    function clearEditeArea() {
        newNoteName[0].value = '';
        newNoteTextarea.empty();
        pathInput.empty();
    };
    //搜索功能
    searchBtn.on('click', function () {
        var value = searchInput[0].value,
            width = parseInt(searchInput.css('width'));
        if (width > 100 && value) {
            searchInput[0].style.width = '0px';
            searchInput[0].style.paddingLeft = '0px';
            searchInput.blur();
            var resultArr = [];

            allFolders.forEach(function (c, i) {
                var name = c.foldername.indexOf(value);
                if (name > -1) {
                    resultArr.push(c);
                }
            });
            allFiles.forEach(function (c, i) {
                var name = c.filename.indexOf(value),
                    detail = c.detail.indexOf(value);
                if (name > -1 || detail > -1) {
                    resultArr.push(c);
                }
            });
            if (resultArr.length === 0) {
                popupBox.alert('没有该文件！', 1000);
                return;
            }
            showingArr = showFilesFn(resultArr);
            backArrPush();
        }
    });

    //搜索按钮绑定键盘事件
    $(document).on('keypress', function (e) {
        var keyCode = e.which || e.keycod;
        if (keyCode == 13) {
            var value = searchInput[0].value,
                width = parseInt(searchInput.css('width'));
            if (width > 100 && value) {
                e.preventDefault();
                searchInput[0].style.width = '0px';
                searchInput[0].style.paddingLeft = '0px';
                searchInput.blur();
                var resultArr = [];

                allFolders.forEach(function (c, i) {
                    var name = c.foldername.indexOf(value);
                    if (name > -1) {
                        resultArr.push(c);
                    }
                });
                allFiles.forEach(function (c, i) {
                    var name = c.filename.indexOf(value),
                        detail = c.detail.indexOf(value);
                    if (name > -1 || detail > -1) {
                        resultArr.push(c);
                    }
                });
                if (resultArr.length === 0) {
                    popupBox.alert('没有该文件！', 1000);
                    return;
                }
                showingArr = showFilesFn(resultArr);
                backArrPush();
            }
        }
    });

    //星标功能
    starFileBtn.on('click', function () {
        var fileId = divDetail[0].dataset.id,
            position = divDetail[0].dataset.position.split(','),
            starFile,
            ajaxJson,
            header = {
                contentType: 'application/json'
            },
            ajaxObj = {
                position: position
            };
        if (starFileBtn.hasClass('icon-heart')) {//如果已经星标，则取消星标
            starFile = searchFile(starArr, fileId);
            ajaxObj.stared = 'no';
            ajaxJson = JSON.stringify(ajaxObj);
            if (starFile) {
                starArr.pop(starFile);
                starFile.stared = 'no';
            }
            starFileBtn.removeClass('icon-heart').addClass('icon-heart-empty');

            ajax.post('photo-server/server.js?type=save', ajaxJson, function () {
                popupBox.alert('取消星标成功!', 1000);
            }, header);
        } else {//如果没有星标，则星标
            starFile = searchFile(allFiles, fileId);
            ajaxObj.stared = 'yes';
            ajaxJson = JSON.stringify(ajaxObj);
            if (starFile) {
                starArr.push(starFile);
                starFile.stared = 'yes';
            }
            starFileBtn.removeClass('icon-heart-empty').addClass('icon-heart');

            ajax.post('photo-server/server.js?type=save', ajaxJson, function () {
                popupBox.alert('星标成功!', 1000);
            }, header);
        }
    });

    bindEntrustEvent('click', '#second-category', 'second-category', function (target) {//展示点击的文件或文件夹

        var searchId = target.parentNode.dataset.id;//取得文件夹的id
        var searchO = searchId.indexOf('o');

        if (searchO < 0) {//打开文件
            allFiles.forEach(function (c, i) {
                if (c.fileId === searchId) {
                    openFile(c);
                }
            });

        } else if (searchO > 0) { //展示文件夹
            allFolders.forEach(function (c, i) {
                if (c.folderId === searchId) {
                    var cFiles = c.files;
                    showingArr = showFilesFn(cFiles);
                    backArrPush();
                }
            });
        }
    });

    bindEntrustEvent('click', '#root-dir', 'category-item', function (target) {//生成二级分类
        if (target.tagName === 'SPAN') {
            target = $(target).next()[0];
        }
        sonCategoryData = data[target.textContent];//获得子文件数组
        showingArr = showFilesFn(sonCategoryData);//展示文件
        backArrPush();//存储展示的内容到 back数组
        gFirstCategory.find('span').removeClass('icon-folder-open-alt').addClass('icon-folder-close-alt');
        $(target).prev('span').removeClass('icon-folder-close-alt').addClass('icon-folder-open-alt');

        if (windowWidth <= 768) { //在移动端，当被点击的文件夹在边缘的时候，向中间滚动
            var parentDomRect = gFirstCategory[0].getBoundingClientRect(),
                thisDomRect = target.getBoundingClientRect(),
                selfX = thisDomRect.left,
                selfWidth = thisDomRect.width,
                ulWidth = target.offsetParent.offsetWidth,
                currentScrollLeft = gFirstCategory[0].scrollLeft,
                maxScroll = ulWidth - parentDomRect.width,//gFirstCategory的滚动范围 0 - (ulWidth-parentDomRect.width)
                noScrollRange = [selfWidth * 0.5 + parentDomRect.left, parentDomRect.left + selfWidth * 3.5];//不滚动区间 selfX的值范围
            if (selfX >= noScrollRange[1]) {
                //向左滚动
                var scrollTo = currentScrollLeft + selfWidth;
                scrollTo = scrollTo > maxScroll ? maxScroll : scrollTo;
                var interval = window.setInterval(function () {
                    gFirstCategory.scrollLeft(currentScrollLeft += 10);
                    if (currentScrollLeft >= scrollTo) {
                        window.clearInterval(interval);
                    }
                }, 20);
            } else if (selfX <= noScrollRange[0]) {
                //向右滚动
                var scrollTo = currentScrollLeft - selfWidth;
                scrollTo = scrollTo < 0 ? 0 : scrollTo;
                var interval = window.setInterval(function () {
                    gFirstCategory.scrollLeft(currentScrollLeft -= 10);
                    if (currentScrollLeft <= scrollTo) {
                        window.clearInterval(interval);
                    }
                }, 20);
            }
        }

    });

    bindEntrustEvent('click', '#functions', 'back-btn', function (target) {//绑定后退 按钮
        var blen = backArr.length;
        if (blen === 0 || blen === 1) {
            return;
        }

        backNumber = backNumber < blen ? backNumber + 1 : 1;
        showNumber = blen - backNumber;
        showingArr = showFilesFn(backArr[showNumber]);
    });

    bindEntrustEvent('click', '#functions', 'forward-btn', function (target) {//绑定前进 按钮
        var blen = backArr.length;
        if (blen === 0 || blen === 1) {
            return;
        }

        if (backNumber > 1) {
            backNumber = backNumber - 1;
        } else if (backNumber === 1 && blen > 1) {
            backNumber = blen;
        }

        showNumber = blen - backNumber;
        showingArr = showFilesFn(backArr[showNumber]);
    });

    //文件结构展示功能方法区 开始
    function showfolderTree() {
        folderTreeContainer.css('transform', 'scaleX(1)');
        var firstCategory = Object.keys(data); //取到一级目录，并显示
        if (!folderTreeFirst.text()) {
            createFolderUl(firstCategory, folderTreeFirst, false, false, { number: 1 });
        }
    };

    function createFolderUl(arr, ulFather, spanFather, target, dataset) {
        createFn.createUlList(arr, ulFather, 'folder-tree-items', 'icon-folder-close-alt icon-margin', 'cover-div', dataset);

        openIcon(target, spanFather);
    };

    function clearFolderLine(d) {
        var folderLineArr = $('.folder-line'), len = folderLineArr.length;
        for (var i = d; i < len; i++) {
            $(folderLineArr[i]).remove();
        }
    };

    function openIcon(target, spanFather) {//打开文件夹图标，同时关闭其他文件夹图标
        if (spanFather) {
            $(spanFather).find('span').removeClass('icon-folder-open-alt').addClass('icon-folder-close-alt');
        }
        if (target) {
            $(target).prevAll('span').removeClass('icon-folder-close-alt').addClass('icon-folder-open-alt');
        }
    };

    function createFolderLine(divNumber) {
        var div = document.createElement('div'),
            folderLineArr,
            nextDivNumber = parseInt(divNumber) + 1;
        div.className = 'folder-line';
        showFolderTree.append(div);//append之后，取所有的folder-line
        folderLineArr = $('.folder-line');
        return {
            folderArr: folderLineArr,
            number: nextDivNumber
        };
    };
    //文件结构展示功能方法区 结束

    function shutDownNote() {//关闭打开的笔记
        detailContainer[0].style.left = "100%";
        starFileBtn.removeClass('icon-heart').addClass('icon-heart-empty');
    };

    function searchFile(fileArr, fileId) {//搜索目标数组，看有没有该文件
        var boo = false;
        fileArr.forEach(function (c, i) {
            if (c.fileId === fileId) {
                boo = c;
            }
        });
        return boo;
    };

    function dateAdd0(time){
        return time < 10 ? "0" + time : time;
    };

    function openFile(fileObj) {//打开文件
        var fileDetail = fileObj.detail,
            fileId = fileObj.fileId,
            position = fileObj.position.join(),
            fileName = fileObj.filename,
            fileDate = fileObj.mdate ? fileObj.mdate + ' ' + fileObj.mtime : fileObj.cdate + ' ' + fileObj.ctime;
        if (fileDetail[1] == 'p') {//展示笔记内容
            divDetail.html(fileDetail);
        } else {
            divDetail.html('<p>' + fileDetail + '</p>');
        }
        divDetail.attr('data-id', fileId);
        divDetail.attr('data-position', position);
        detailHtml = divDetail.html();//防Xss攻击，必须在新笔记写入divDetail后，再赋值给detailHtml

        noteNameSpan.text(fileName);//显示笔记名字
        noteDateSpan.text(fileDate);//显示笔记创建日期

        if (searchFile(starArr, fileId)) {//根据文件是否星标，来设置星标按钮的样式
            starFileBtn.removeClass('icon-heart-empty').addClass('icon-heart');
        }

        if (windowWidth > 768) {
            detailContainer[0].style.left = "20%";
        } else if (windowWidth < 768) {
            detailContainer[0].style.left = "0";
        }
    };

    function flatFn() {//更新所有数据的时候需要执行的筛选方法
        var top = Object.entries(data), foldersEctype;//拆分并集合文件夹和文件
        top.forEach(function (c, i) {
            if (c[1].length > 0) {
                c[1].forEach(function (c, i) {
                    if (c.type === "folder") {
                        allFolders.push(c);
                    } else if (c.type === "file") {
                        allFiles.push(c);
                    }
                });
            }
        });
        foldersEctype = Array.from(allFolders);//复制数组，这种功能一眼看过去不知道怎么做，就先开始干，想到哪儿干哪儿，缺什么就补什么，最后也能成
        do {
            var loopArr = [];
            foldersEctype.forEach(function (c, i) {
                if (c.files.length > 0) {
                    c.files.forEach(function (c, i) {
                        if (c.type === "folder") {
                            loopArr.push(c);
                            allFolders.push(c);
                        } else if (c.type === "file") {
                            allFiles.push(c);
                        }
                    });
                }
                foldersEctype = loopArr;
            });
        } while (foldersEctype.length > 0);//继续筛选文件夹

        if (starArr.length === 0) {
            allFiles.forEach(function (c, i) {//找出星标文件，进行展示
                if (c.stared === 'yes') {
                    starArr.push(c);
                }
            });
        }

        if (execBoo) {
            showingArr = showFilesFn(starArr);
            backArrPush();
            execBoo = false;
        }
    };

    function backArrPush(filess) {//存储前进后退内容
        var backArrLen = backArr.length, files = filess || showingArr;
        if (files.length === 0 || objEq.objectEqual(files, backArr[backArrLen - 1])) {//确保后退数组的内容可用性,并且连续两次展示的内容不一样
            return;
        } else {
            backArr.push(files);
        }
    };

    function getdata(d) {//刷新页面首先要做的事情
        data = d;
        var firstCategory = Object.keys(d); //取到一级目录，并显示
        createFn.createUlList(firstCategory, gFirstCategory, 'category-item', 'icon-folder-close-alt icon-margin');
        flatFn();
    };

    function getData(fn) {
        var noteData,
            xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                noteData = JSON.parse(xmlHttp.responseText);
                fn(noteData);
            }
        };
        xmlHttp.open('POST', 'photo-server/server.js?type=pull', true);
        xmlHttp.send();
    };

    function bindEntrustEvent(eventType, entrustedEl, entrustClassname, fn) {//事件类型  被委托元素  委托元素的class 执行的函数
        $(entrustedEl).on(eventType, function (e) {
            e.preventDefault();
            var target = e.target;
            if (target.className.indexOf(entrustClassname) > -1) {
                fn(target);
            }
        });
    };


});