// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Array.prototype.Sum = function () {
    var result = 0;
    for (var i = 0; i < this.length; i++) {
        result += this[i];
    }
    return result;
};

//组合帮助方法
(function () {
    $.extend($, {
        combine: {}
    });
    $.extend($.combine, {
        /*
        获取全部组合数
        arr 将要获取组合的数组
        start 开始位置
        record 缓存盒子，为数组 长度=count
        count 组合的长度
        result 返回结果，为数组
        */
        cc: function (arr, start, record, count, result) {
            for (var i = start; i < arr.length + 1 - count; i++) {
                record[count - 1] = i;
                if (count - 1 == 0) {
                    var temp = [];
                    for (var j = record.length - 1; j >= 0; j--)
                        temp.push(arr[record[j]]);
                    result.push(temp);
                }
                else
                    $.combine.cc(arr, i + 1, record, count - 1, result);

            }
        },
        /*
        获取投注结果
        arr 为cc中返回的result
        */
        get_vote: function (arr) {
            var result = [];

            for (var i = 0; i < arr.length; i++) {
                var mids = [];

                for (var j = 0; j < arr[i].length; j++) {
                    mids.push(arr[i][j][0]);

                    if (j == arr[i].length - 1) {
                        if ($.unique(mids).length == arr[i].length) {
                            result.push(arr[i]);
                        }
                    }
                }
            }

            return result;
        }
    });
})();

// 浏览器检测
var browser = (function () {
  var userAgent = navigator.userAgent;
  var iosRE = /ip(hone|ad)/i;
  var androidRE = /android/i;
  var maybeIos = iosRE.test(userAgent);
  var maybeAndroid = androidRE.test(userAgent);
  var maybePc = maybeIos || maybeAndroid ? false : true;

  return {
    isIos: maybeIos,
    isAndroid: maybeAndroid,
    isPc: maybePc
  };
})();
