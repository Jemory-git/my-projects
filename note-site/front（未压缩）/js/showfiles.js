
//在展示区显示文件夹 和 文件的模块
define([
    'jquery',
    'create-element',
    'pop-up-box'
], function ($, createFn, popupBox) {
    'use strict';
    function showFiles(filsArr) {
        var showingArr = filsArr;
        // console.log(showingArr);
        if (filsArr.length === 0) {
            popupBox.alert('此文件夹为空!', 500);
            return showingArr;;
        }
        $('#second-category').empty();//清空展示区

        var folderArr = [], fileArr = [];//分开数据的文件和文件夹

        filsArr.forEach(function (c, i) {
            if (c.type === "folder") {
                var folderobj = { "name": c.foldername, "id": c.folderId };
                folderArr.push(folderobj);
            } else if (c.type === "file" && (!c.showBoo || c.showBoo === 'true')) {//虚拟删除功能，待修正
                var fileobj = { "name": c.filename, "id": c.fileId };
                fileArr.push(fileobj);
            }
        });

        //生成文件和文件夹li
        createFn.createLi(folderArr, '#second-category', 'second-category', 'icon-folder-close-alt icon-margin', 'li-scale');
        createFn.createLi(fileArr, '#second-category', 'second-category', 'icon-file-alt icon-margin', 'li-scale');

        return showingArr;
    };
    return {
        showFiles: showFiles
    };
});