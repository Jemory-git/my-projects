define(["jquery","create-element","pop-up-box"],function(e,o,r){"use strict";return{showFiles:function(n){var c=n;if(0===n.length)return r.alert("此文件夹为空!",500),c;e("#second-category").empty();var i=[],t=[];return n.forEach(function(e,o){if("folder"===e.type){var r={name:e.foldername,id:e.folderId};i.push(r)}else if("file"===e.type&&(!e.showBoo||"true"===e.showBoo)){var n={name:e.filename,id:e.fileId};t.push(n)}}),o.createLi(i,"#second-category","second-category","icon-folder-close-alt icon-margin","li-scale"),o.createLi(t,"#second-category","second-category","icon-file-alt icon-margin","li-scale"),c}}});