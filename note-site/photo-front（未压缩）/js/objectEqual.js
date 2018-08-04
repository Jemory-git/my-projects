
//判断两个对象 或者 两个数组是不是相等的模块
define(function () {

    function objectEqual(a, b) { //如果不知道两个是对象还是数组用这个方法，如果明确知道是对象还是数组用下面的twoArr和twoObj
        if (Array.isArray(a) && Array.isArray(b)) {
            //进行数组比较
            if (twoArr(a, b)) {
                return true;
            } else {
                return false;
            }
        } else if (isObject(a) && isObject(b)) {
            //进行对象比较
            if (twoObj(a, b)) {
                return true;
            } else {
                return false;
            }
        } else { //不是数组就是对象吗？是的，其他的很容易判断，用不着这个复杂方法.所以没写twoFun 、 twoPri
            return false;
        }
    };

    function twoArr(a, b) {
        var aLen = a.length,
            bLen = b.length;
        if (aLen === bLen) {
            if (bLen === 0) {
                return true;
            } else if (bLen !== 0) {
                var resultA = splitArrValue(a),
                    resultB = splitArrValue(b);

                if (!twoPriArr(resultA.priArr, resultB.priArr)) { //比较两个装有原始值的数组
                    return false;
                } else if (!twoFunArr(resultA.funArr, resultB.funArr)) { //比较另外两个function数组
                    return false;
                } else if (!twoObjArr(resultA.objArr, resultB.objArr)) { //比较objArr
                    return false;
                } else if (!twoArrArr(resultA.arrArr, resultB.arrArr)) { //比较arrArr
                    return false;
                } else { //到这儿，说明都相等，返回true
                    return true;
                }
            }
        } else {
            return false;
        }

    };

    function twoObj(a, b) {
        var propertysA = Object.getOwnPropertyNames(a),
            propertysB = Object.getOwnPropertyNames(b);

        if (!twoPriArr(propertysA, propertysB)) { //比较两个装有属性的数组（一定是原始值数组）
            return false;
        } else { //比较值

            var priA = [],
                priB = [],
                objA = [],
                objB = [],
                arrA = [],
                arrB = [],
                funA = [],
                funB = [];
            propertysA.forEach(function (c, i, arr) { //保存a对象的属性值，区分原始值  、 对象 、 function 、 数组
                var valA = a[c];
                if (isPrimitiveType(valA)) {
                    priA.push(valA);
                } else if (isObject(valA)) {
                    objA.push(valA);
                } else if (typeof (valA) === 'function') {
                    funA.push(valA);
                } else if (Array.isArray(valA)) {
                    arrA.push(valA);
                }
            });

            propertysB.forEach(function (c, i, arr) { //保存b对象的属性值，区分原始值  、 对象 、 function 、 数组
                var valB = b[c];
                if (isPrimitiveType(valB)) {
                    priB.push(valB);
                } else if (isObject(valB)) {
                    objB.push(valB);
                } else if (typeof (valB) === 'function') {
                    funB.push(valB);
                } else if (Array.isArray(valB)) {
                    arrB.push(valB);
                }
            });

            if (!twoPriArr(priA, priB)) { //比较两个装有原始值的数组
                return false;
            } else if (!twoFunArr(funA, funB)) { //如果这两个原始值数组相等 ， 就比较另外两个function数组
                return false;
            } else if (!twoObjArr(objA, objB)) { //比较objA 和 objB
                return false;
            } else if (!twoArrArr(arrA, arrB)) { //比较arrA 和 arrB
                return false;
            } else { //到这儿，说明都相等，返回true
                return true;
            }
        }
    };

    function twoPriArr(priA, priB) { //传入两个原始值数组
        var priALen = priA.length,
            priBLen = priB.length;

        if (priALen === priBLen && priALen !== 0) { //如果长度相等，并且不是0， 进入下一步比较
            for (var i = 0; i < priALen; i++) { //比较二者原始值是否相等
                if (priA[i] !== priB[i]) {
                    return false;
                }
            }
            return true;
        } else if (priALen === priBLen && priALen === 0) {
            return true;
        } else {
            return false;
        }
    };

    function twoFunArr(funA, funB) { //function数组，可以tostring，之后就可以作为原始值进行比较了
        var funALen = funA.length,
            funBLen = funB.length;

        if (funALen === funBLen) {
            if (funALen === 0) {
                return true;
            } else if (funALen !== 0) {
                var strA = [],
                    strB = [];
                for (var i = 0; i < funALen; i++) {
                    strA.push(funA[i].toString());
                    strB.push(funB[i].toString());
                }

                for (var i = 0; i < funALen; i++) {
                    if (strA[i] !== strB[i]) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            return false;
        }

    };

    function twoObjArr(objA, objB) {
        var objALen = objA.length,
            objBLen = objB.length;

        if (objALen === objBLen) {
            if (objALen === 0) {
                return true;
            } else if (objALen !== 0) {
                for (var i = 0; i < objALen; i++) {
                    if (!twoObj(objA[i], objB[i])) { //循环调用twoObj 进行比较
                        return false;
                    }
                }
                return true;
            }
        } else {
            return false;
        }
    };

    function twoArrArr(objA, objB) {
        var objALen = objA.length,
            objBLen = objB.length;

        if (objALen === objBLen) {
            if (objALen === 0) {
                return true;
            } else if (objALen !== 0) {
                for (var i = 0; i < objALen; i++) {
                    if (!twoArr(objA[i], objB[i])) { //循环调用twoArr 进行比较
                        return false;
                    }
                }
                return true;
            }
        } else {
            return false;
        }

    };

    function isObject(obj) {
        if (typeof (obj) === 'object' && obj !== null && !Array.isArray(obj)) {
            return true;
        } else {
            return false;
        }
    };

    function isPrimitiveType(o) {
        var type = typeof (o);
        if (type === 'function' || (type === 'object' && o !== null)) {
            return false;
        } else {
            return true;
        }
    };

    function splitObjValue(obj) { //将对象的值按类型进行拆分，并保存
        var propertys = Object.getOwnPropertyNames(obj);

        var priA = [],
            objA = [],
            arrA = [],
            funA = [];
        propertys.forEach(function (c, i, arr) { //保存对象的属性值，区分原始值  、 对象 、 function 、 数组
            var valA = obj[c];
            if (isPrimitiveType(valA)) {
                priA.push(valA);
            } else if (isObject(valA)) {
                objA.push(valA);
            } else if (typeof (valA) === 'function') {
                funA.push(valA);
            } else if (Array.isArray(valA)) {
                arrA.push(valA);
            }
        });

        return {
            priArr: priA,
            objArr: objA,
            funArr: funA,
            arrArr: arrA
        }
    };

    function splitArrValue(arr) { //将数组的值按类型进行拆分，并保存，区分原始值  、 对象 、 function 、 数组

        var priA = [],
            objA = [],
            arrA = [],
            funA = [];
        arr.forEach(function (c, i, arr) { //保存对象的属性值，

            if (isPrimitiveType(c)) {
                priA.push(c);
            } else if (isObject(c)) {
                objA.push(c);
            } else if (typeof (c) === 'function') {
                funA.push(c);
            } else if (Array.isArray(c)) {
                arrA.push(c);
            }
        });

        return {
            priArr: priA,
            objArr: objA,
            funArr: funA,
            arrArr: arrA
        }
    };
    return {
        objectEqual: objectEqual
    };
});