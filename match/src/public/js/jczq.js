//转到app页面
function goAPP(page) {
    if (window.WebViewJavascriptBridge) {
        window.WebViewJavascriptBridge.callHandler(
                'goAPP'
                , { "page": page }
                , function (responseData) {
                }
            );
    }
}

aacount = void 0;
typeSelected = true;

//android bridge初始化开始-------------------------------------------
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function () {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}
//android bridge初始化结束-------------------------------------------

//ios bridge初始化开始-------------------------------------------
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}
//ios bridge初始化结束-------------------------------------------

// 根据当前设备调用对应的bridge初始化
var initDeviceBridge = function (callbackQueue) {
  browser.isIos
    ? setupWebViewJavascriptBridge(callbackQueue[0])
    : browser.isAndroid
      ? connectWebViewJavascriptBridge(callbackQueue[1])
      : void 0;
};

initDeviceBridge([
  function (bridge) {
    bridge.registerHandler('setToken', function (data, responseCallback) {
        $.cookie('token', data);
        localStorage.setItem('token', data);
        setVip();
        //var responseData = 'Right back atcha!'
        //responseCallback(responseData)
    })
  },
  function (bridge) {
      bridge.init(function (message, responseCallback) {
          responseCallback(data);
      });

      bridge.registerHandler("setToken", function (data, responseCallback) {
          $.cookie('token', data);
          localStorage.setItem('token', data);
          setVip();
          //responseCallback("123");
      });
  }
])

// connectWebViewJavascriptBridge(function (bridge) {
//     bridge.init(function (message, responseCallback) {
//         responseCallback(data);
//     });
//
//     bridge.registerHandler("setToken", function (data, responseCallback) {
//         $.cookie('token', data);
//         //responseCallback("123");
//     });
// });
//
//
//
//
// setupWebViewJavascriptBridge(function (bridge) {
//     bridge.registerHandler('setToken', function (data, responseCallback) {
//         $.cookie('token', data);
//         //var responseData = 'Right back atcha!'
//         //responseCallback(responseData)
//     })
// })

var bonusOptimize, isVip;

$(document).bind('click', function (e) {
    var e = e || window.event; //浏览器兼容性
    var elem = e.target || e.srcElement;
    while (elem) { //循环判断至跟节点，防止点击的是div子元素
        if (elem.className == 'cate_wrp') {
            return;
        }
        elem = elem.parentNode;
    }

    //$(".cate_drop").hide();
});

var tabs = function () {
    return {
        set: function (elemId, num) {
            var $cate = $('#' + elemId + num),
            $tri = $('.cate_tri', $cate),
            $drop = $('div.cate_drop', $cate),
            $inp = $('div.cate_inp', $cate);

            $tri.on('click', function (event) {
                //$(".cate_drop").hide();
                var $el = $(this);
                if ($el.data('active') !== 'on') {
                    $drop[0].style.display = 'block';
                    $el.data('active', 'on');
                } else {
                    $drop[0].style.display = 'none';
                    $el.data('active', 'off')
                }

                $.makeArray($('#play_ul .play_item')).forEach(function (element) {
                    $(element).hide().removeClass('selected');
                });
            });
            $drop.on('click', 'li', function (event) {
                if ($(this).parents('#cate21').size()) {
                  return;
                }

                $inp[0].innerHTML = this.innerHTML;
                $($inp[0]).attr("value", $(this).attr("value"));
                $drop[0].style.display = 'none';
                $tri.data('active', 'off');
                $("#nav1 li").removeClass("selected");
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");

                if (num == 21) {
                    thisApp.methods.calculate_lottery(parseInt($($inp[0]).attr("value")));
                }

                if (num == 1) {
                    thisApp.methods.match_count();
                }
            });
        }
    }
}();
var loaded = false;
var navs = function () {
    return {
        set: function (elemId, num) {
            var elem = $("#" + elemId + num + " .navButton");
            elem.each(function (i) {
                $(this).click(function () {
                    $(".nav" + num).hide();
                    $(".tag" + num + i).show();

                    if (!loaded) {
                        loaded = true;
                        $("#loading").show();
                        $.ajax({
                            url: "http://106.75.20.166:8004/products/matchOdds",
                            contentType: "application/json; charset=utf-8",
                            type: "post",
                            data: "{}",
                            success: function (result) {
                                $("#loading").hide();
                                console.log(result);
                                $.each(thisvue.group_ex, function (index1, group1) {
                                    $.each(group1.matchs, function (index1, match11) {
                                        $.each(result.data.odds, function (index2, group2) {
                                            $.each(group2.matchs, function (index21, match21) {
                                                if (match21.MID == match11.MID) {
                                                    Vue.set(match11, 'BF_SP91', match21.BF_SP91)
                                                    Vue.set(match11, 'BF_SP93', match21.BF_SP93)
                                                    Vue.set(match11, 'BF_SP10', match21.BF_SP10)
                                                    Vue.set(match11, 'SPF_DG', match21.SPF_DG)
                                                    Vue.set(match11, 'BF_DG', match21.BF_DG)
                                                    Vue.set(match11, 'RQSPF_SP0', match21.RQSPF_SP0)
                                                    Vue.set(match11, 'RQSPF_SP1', match21.RQSPF_SP1)
                                                    Vue.set(match11, 'BF_SP52', match21.BF_SP52)
                                                    Vue.set(match11, 'BF_SP15', match21.BF_SP15)
                                                    Vue.set(match11, 'BF_SP90', match21.BF_SP90)
                                                    Vue.set(match11, 'BF_SP51', match21.BF_SP51)
                                                    Vue.set(match11, 'BF_SP50', match21.BF_SP50)
                                                    Vue.set(match11, 'BF_SP13', match21.BF_SP13)
                                                    Vue.set(match11, 'BQC_SP00', match21.BQC_SP00)
                                                    Vue.set(match11, 'BF_SP14', match21.BF_SP14)
                                                    Vue.set(match11, 'BQC_SP01', match21.BQC_SP01)
                                                    Vue.set(match11, 'BF_SP11', match21.BF_SP11)
                                                    Vue.set(match11, 'BF_SP12', match21.BF_SP12)
                                                    Vue.set(match11, 'BQC_SP03', match21.BQC_SP03)
                                                    Vue.set(match11, 'SPF_GD', match21.SPF_GD)
                                                    Vue.set(match11, 'RQSPF_SP3', match21.RQSPF_SP3)
                                                    Vue.set(match11, 'BQC_SP33', match21.BQC_SP33)
                                                    Vue.set(match11, 'BQC_GD', match21.BQC_GD)
                                                    Vue.set(match11, 'BQC_SP30', match21.BQC_SP30)
                                                    Vue.set(match11, 'JQS_SP5', match21.JQS_SP5)
                                                    Vue.set(match11, 'JQS_SP4', match21.JQS_SP4)
                                                    Vue.set(match11, 'JQS_SP7', match21.JQS_SP7)
                                                    Vue.set(match11, 'BQC_SP31', match21.BQC_SP31)
                                                    Vue.set(match11, 'JQS_SP6', match21.JQS_SP6)
                                                    Vue.set(match11, 'JQS_SP1', match21.JQS_SP1)
                                                    Vue.set(match11, 'JQS_GD', match21.JQS_GD)
                                                    Vue.set(match11, 'JQS_SP0', match21.JQS_SP0)
                                                    Vue.set(match11, 'JQS_SP3', match21.JQS_SP3)
                                                    Vue.set(match11, 'JQS_SP2', match21.JQS_SP2)
                                                    Vue.set(match11, 'BF_SP20', match21.BF_SP20)
                                                    Vue.set(match11, 'BF_SP21', match21.BF_SP21)
                                                    Vue.set(match11, 'JQS_DG', match21.JQS_DG)
                                                    Vue.set(match11, 'SPF_SP3', match21.SPF_SP3)
                                                    Vue.set(match11, 'BF_SP22', match21.BF_SP22)
                                                    Vue.set(match11, 'BF_SP23', match21.BF_SP23)
                                                    Vue.set(match11, 'BF_SP24', match21.BF_SP24)
                                                    Vue.set(match11, 'BF_SP25', match21.BF_SP25)
                                                    Vue.set(match11, 'TEMPERATURE', match21.TEMPERATURE)
                                                    Vue.set(match11, 'SCORE_HALF', match21.SCORE_HALF)
                                                    Vue.set(match11, 'AWARY', match21.AWARY)
                                                    Vue.set(match11, 'JCID', match21.JCID)
                                                    Vue.set(match11, 'SPF_SP0', match21.SPF_SP0)
                                                    Vue.set(match11, 'SPF_SP1', match21.SPF_SP1)
                                                    Vue.set(match11, 'BF_SP33', match21.BF_SP33)
                                                    Vue.set(match11, 'ST', match21.ST)
                                                    Vue.set(match11, 'OH', match21.OH)
                                                    Vue.set(match11, 'JCID_BACK', match21.JCID_BACK)
                                                    Vue.set(match11, 'OD', match21.OD)
                                                    Vue.set(match11, 'OA', match21.OA)
                                                    Vue.set(match11, 'BF_SP32', match21.BF_SP32)
                                                    Vue.set(match11, 'BF_SP31', match21.BF_SP31)
                                                    Vue.set(match11, 'BF_SP30', match21.BF_SP30)
                                                    Vue.set(match11, 'BQC_DG', match21.BQC_DG)
                                                    Vue.set(match11, 'SCORE', match21.SCORE)
                                                    Vue.set (match11, 'AWARY3', match21.AWARY3)
                                                    Vue.set(match11, 'RQSPF_DG', match21.RQSPF_DG)
                                                    Vue.set(match11, 'BQC_SP10', match21.BQC_SP10)
                                                    Vue.set(match11, 'BQC_SP13', match21.BQC_SP13)
                                                    Vue.set(match11, 'BF_SP00', match21.BF_SP00)
                                                    Vue.set(match11, 'BF_SP01', match21.BF_SP01)
                                                    Vue.set(match11, 'BQC_SP11', match21.BQC_SP11)
                                                    Vue.set(match11, 'BF_SP02', match21.BF_SP02)
                                                    Vue.set(match11, 'BF_SP03', match21.BF_SP03)
                                                    Vue.set(match11, 'LET', match21.LET)
                                                    Vue.set(match11, 'BF_SP41', match21.BF_SP41)
                                                    Vue.set(match11, 'BF_SP04', match21.BF_SP04)
                                                    Vue.set(match11, 'BF_SP40', match21.BF_SP40)
                                                    Vue.set(match11, 'BF_SP05', match21.BF_SP05)
                                                    Vue.set(match11, 'RQSPF_GD', match21.RQSPF_GD)
                                                    Vue.set(match11, 'HOME3', match21.HOME3)
                                                    Vue.set(match11, 'BF_GD', match21.BF_GD)
                                                    Vue.set(match11, 'BF_SP42', match21.BF_SP42)
                                                }
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            });
        }
    }
}();

function click_ready() {
    //$(".nav1").each(function (i, e) {
    //    $(e).find(".panel").first().show();
    //});

    $(".flip").unbind("click").click(function () {
        $(".panel:eq(" + $(this).index(".flip") + ")").slideToggle("fast");
    });

    $(".selection").unbind("click").click(function () {
        if ($(this).hasClass("shit_now")) {
            $(this).removeClass("shit_now")
            $(this).find("span").addClass("yellow")
        } else {
            $(this).find("span").removeClass("yellow")
            $(this).addClass("shit_now")
        }
        thisApp.methods.match_count();

        if ($("#match_selected").html() > 12) {
            $(this).removeClass("shit_now")
            $(this).find("span").addClass("yellow")
            tip1("最多只能选择12场比赛！");
            thisApp.methods.match_count();
        }

        //计算当前比赛选择数
        var self_count = $(this).parents(".for_self_selected").find(".shit_now").length;
        var self_html = '已选 ' + '<span style="color:red;">' + self_count + '</span>' + ' 项';
        $(this).parents(".for_self_selected").prev().html(self_html);
    });

    $(".league").unbind("click").click(function () {
        if ($(this).hasClass("league")) {
            $(this).removeClass("league")
            $(this).addClass("league_now")
        } else {
            $(this).removeClass("league_now")
            $(this).addClass("league")
        }
    });
}

function tip1(msg) {
    document.getElementById('t6').style.display = 'block';
    $("#t6 p").html(msg);
}

function tip2(msg1, msg2) {
    document.getElementById('t5').style.display = 'block';
    $("#t5 .msg").html('<p>' + msg1 + '</p>' + '<p>' + msg2 + '</>');
}

var thisvue = new Vue({
    el: "#jc_content",
    data: {
        group_ex: [],
        group_ln: [],
        ln_selected: [],
        match_selected_arr: []
    },
    updated: function () {
        click_ready();

        var type = parseInt($("#tag_select").attr("value"));
        var maxCount = type == 11 || type == 13
          ? 4
          : type == 12
            ? 6
            : 8;
        if (typeSelected) {
          $('#play_ul').find('li').hide();

          for (var i = 1; i <= maxCount; i++) {
              if (i <= this.match_selected_arr.length) {
                  $("#play_li" + i).show();
              } else {
                  $("#play_li" + i).hide();
              }
          }

          if ($('#tag_select').attr('value') == 15) {
            var gameListElement = $('.tag15').find('.shit_now').parents('.match_info');
            var toArray = $.makeArray(gameListElement);
            var isSelected = (toArray.length > 1 && toArray.some(function (element) {
              return $.makeArray($(element).find('.outer.shit_now')).some(function (ele) {
                return $(ele).siblings().find('.dg').length == 0
              }) && $.makeArray($(element).find('.odd_title').find('.shit_now').length == 0)
            }))
              || (
              toArray.length == 1 && $.makeArray($(toArray[0]).find('.outer.shit_now')).some(function (element) {
                return $(element).siblings().find('.dg').length == 0
              }) && $.makeArray($(toArray[0]).find('.odd_title').find('.shit_now')).length == 0
            );

            if (isSelected) {
              $('#play_ul .play_item').eq(0).hide();
            }
          } else if ($('#tag_select').attr('value') == 10) {
            var sgameListElement = $('.tag10').find('.shit_now').parents('.match_info');
            var stoArray = $.makeArray(sgameListElement);

            var sisSelected = (stoArray.length > 1 && stoArray.some(function (element) {
              return $.makeArray($(element).find('.shit_now')).some(function (ele) {
                return $(ele).siblings().find('.dg').length == 0;
              });
            })) || (stoArray.length == 1 && $.makeArray($(stoArray[0]).find('.shit_now')).some(function (element) {
              return $(element).siblings().find('.dg').length == 0;
            }));

            if (sisSelected) {
              $('#play_ul .play_item').eq(0).hide();
            }
          }


          $.makeArray($('#play_ul .play_item')).forEach(function (element) {
            $(element).removeClass('selected');
          });

          if ($('#tag_select').attr('value') == 10 && sisSelected == true && stoArray.length > 1) {
            //alert('s');
            $('#play_ul .play_item').eq(1).addClass('selected');
          } else if ($('#tag_select').attr('value') == 15 && isSelected == true && toArray.length > 1) {
            $('#play_ul .play_item').eq(1).addClass('selected');
          } else {
            $("#play_type").attr("value", "1.1");
            $("#play_type").html("单关");
            $('#play_ul .play_item').eq(0).addClass('selected');
          }
        } else {
          if (bonusOptimize && bonusOptimize.state) {
            var key = bonusOptimize.state.selectedProductTypeIndex === 0
              ? 'average'
              : bonusOptimize.state.selectedProductTypeIndex === 1
                ? 'hot'
                : 'cold';
            var fall = bonusOptimize.state.bettingList[key].list.map(function (item) {
              return item.combines.length + '.1';
            }).filter(function (item, index, arr) {
              return !index || arr.indexOf(item) == index;
            });

            var typeElements = $('#play_ul').find('li');
            typeElements.removeClass('selected');

            fall.forEach(function (value) {
              typeElements.filter('[value="'+ value +'"]').addClass('selected');
            });
            //console.log(bonusOptimize.state.bettingList[key], 'gggg');
          }

        }

        typeSelected = true;
        thisApp.methods.match_count();
        thisApp.methods.calculate_lottery();
    },
    methods: {
        GetBattles: function () {
            var that = this;
            $("#loading").show();
            $.ajax({
                url: "http://106.75.20.166:8004/products/matchList",
                contentType: "application/json; charset=utf-8",
                type: "post",
                data:  '{}',
                success: function (result) {
                    $("#loading").hide();
                    console.log(result);
                    if (result.errcode == '0') {
                        if (result.data.list.group_ex.length <= 0) {
                            tip1("没有查询到任何数据！");
                        } else {
                            that.group_ln = result.data.list.group_ln;
                            that.group_ex = result.data.list.group_ex;

                            that.$nextTick(function () {
                                $("#jc_content").show();
                                tabs.set("cate", 1);//执行
                                tabs.set("cate", 21);//执行
                                tabs.set("cate", 22);//执行
                                navs.set("nav", 1);//执行
                                click_ready();
                            })
                        }
                    } else {
                        tip1(result.errmsg);
                    }
                }
            })
        },
        more: function () {
        	$.ajax({
                url: "http://106.75.20.166:8004/products/matchOdds",
                contentType: "application/json; charset=utf-8",
                type: "post",
                data: "{}",
                success: function (result) {
                    $.each(thisvue.group_ex, function (index1, group1) {
                        $.each(group1.matchs, function (index1, match11) {
                            $.each(result.data.odds, function (index2, group2) {
                                $.each(group2.matchs, function (index21, match21) {
                                    if (match21.MID == match11.MID) {
                                        Vue.set(match11, 'BF_SP91', match21.BF_SP91)
                                        Vue.set(match11, 'BF_SP93', match21.BF_SP93)
                                        Vue.set(match11, 'BF_SP10', match21.BF_SP10)
                                        Vue.set(match11, 'SPF_DG', match21.SPF_DG)
                                        Vue.set(match11, 'BF_DG', match21.BF_DG)
                                        Vue.set(match11, 'RQSPF_SP0', match21.RQSPF_SP0)
                                        Vue.set(match11, 'RQSPF_SP1', match21.RQSPF_SP1)
                                        Vue.set(match11, 'BF_SP52', match21.BF_SP52)
                                        Vue.set(match11, 'BF_SP15', match21.BF_SP15)
                                        Vue.set(match11, 'BF_SP90', match21.BF_SP90)
                                        Vue.set(match11, 'BF_SP51', match21.BF_SP51)
                                        Vue.set(match11, 'BF_SP50', match21.BF_SP50)
                                        Vue.set(match11, 'BF_SP13', match21.BF_SP13)
                                        Vue.set(match11, 'BQC_SP00', match21.BQC_SP00)
                                        Vue.set(match11, 'BF_SP14', match21.BF_SP14)
                                        Vue.set(match11, 'BQC_SP01', match21.BQC_SP01)
                                        Vue.set(match11, 'BF_SP11', match21.BF_SP11)
                                        Vue.set(match11, 'BF_SP12', match21.BF_SP12)
                                        Vue.set(match11, 'BQC_SP03', match21.BQC_SP03)
                                        Vue.set(match11, 'SPF_GD', match21.SPF_GD)
                                        Vue.set(match11, 'RQSPF_SP3', match21.RQSPF_SP3)
                                        Vue.set(match11, 'BQC_SP33', match21.BQC_SP33)
                                        Vue.set(match11, 'BQC_GD', match21.BQC_GD)
                                        Vue.set(match11, 'BQC_SP30', match21.BQC_SP30)
                                        Vue.set(match11, 'JQS_SP5', match21.JQS_SP5)
                                        Vue.set(match11, 'JQS_SP4', match21.JQS_SP4)
                                        Vue.set(match11, 'JQS_SP7', match21.JQS_SP7)
                                        Vue.set(match11, 'BQC_SP31', match21.BQC_SP31)
                                        Vue.set(match11, 'JQS_SP6', match21.JQS_SP6)
                                        Vue.set(match11, 'JQS_SP1', match21.JQS_SP1)
                                        Vue.set(match11, 'JQS_GD', match21.JQS_GD)
                                        Vue.set(match11, 'JQS_SP0', match21.JQS_SP0)
                                        Vue.set(match11, 'JQS_SP3', match21.JQS_SP3)
                                        Vue.set(match11, 'JQS_SP2', match21.JQS_SP2)
                                        Vue.set(match11, 'BF_SP20', match21.BF_SP20)
                                        Vue.set(match11, 'BF_SP21', match21.BF_SP21)
                                        Vue.set(match11, 'JQS_DG', match21.JQS_DG)
                                        Vue.set(match11, 'SPF_SP3', match21.SPF_SP3)
                                        Vue.set(match11, 'BF_SP22', match21.BF_SP22)
                                        Vue.set(match11, 'BF_SP23', match21.BF_SP23)
                                        Vue.set(match11, 'BF_SP24', match21.BF_SP24)
                                        Vue.set(match11, 'BF_SP25', match21.BF_SP25)
                                        Vue.set(match11, 'TEMPERATURE', match21.TEMPERATURE)
                                        Vue.set(match11, 'SCORE_HALF', match21.SCORE_HALF)
                                        Vue.set(match11, 'AWARY', match21.AWARY)
                                        Vue.set(match11, 'JCID', match21.JCID)
                                        Vue.set(match11, 'SPF_SP0', match21.SPF_SP0)
                                        Vue.set(match11, 'SPF_SP1', match21.SPF_SP1)
                                        Vue.set(match11, 'BF_SP33', match21.BF_SP33)
                                        Vue.set(match11, 'ST', match21.ST)
                                        Vue.set(match11, 'OH', match21.OH)
                                        Vue.set(match11, 'JCID_BACK', match21.JCID_BACK)
                                        Vue.set(match11, 'OD', match21.OD)
                                        Vue.set(match11, 'OA', match21.OA)
                                        Vue.set(match11, 'BF_SP32', match21.BF_SP32)
                                        Vue.set(match11, 'BF_SP31', match21.BF_SP31)
                                        Vue.set(match11, 'BF_SP30', match21.BF_SP30)
                                        Vue.set(match11, 'BQC_DG', match21.BQC_DG)
                                        Vue.set(match11, 'SCORE', match21.SCORE)
                                        Vue.set (match11, 'AWARY3', match21.AWARY3)
                                        Vue.set(match11, 'RQSPF_DG', match21.RQSPF_DG)
                                        Vue.set(match11, 'BQC_SP10', match21.BQC_SP10)
                                        Vue.set(match11, 'BQC_SP13', match21.BQC_SP13)
                                        Vue.set(match11, 'BF_SP00', match21.BF_SP00)
                                        Vue.set(match11, 'BF_SP01', match21.BF_SP01)
                                        Vue.set(match11, 'BQC_SP11', match21.BQC_SP11)
                                        Vue.set(match11, 'BF_SP02', match21.BF_SP02)
                                        Vue.set(match11, 'BF_SP03', match21.BF_SP03)
                                        Vue.set(match11, 'LET', match21.LET)
                                        Vue.set(match11, 'BF_SP41', match21.BF_SP41)
                                        Vue.set(match11, 'BF_SP04', match21.BF_SP04)
                                        Vue.set(match11, 'BF_SP40', match21.BF_SP40)
                                        Vue.set(match11, 'BF_SP05', match21.BF_SP05)
                                        Vue.set(match11, 'RQSPF_GD', match21.RQSPF_GD)
                                        Vue.set(match11, 'HOME3', match21.HOME3)
                                        Vue.set(match11, 'BF_GD', match21.BF_GD)
                                        Vue.set(match11, 'BF_SP42', match21.BF_SP42)
                                    }
                                });
                            });
                        });
                    });
                }
            });
            
//          $(function(){
//				setInterval(getTime(), 1000); //每隔一秒运行一次
//			})
//          
//			//取得系统当前时间
//			function getTime(){
//				var currentTime  = new Date();
//				console.log(currentTime)
//				var year = currentTime.toLocaleDateString();
//				console.log(year)
//				var year = currentTime.getFullYear();
//				var month = currentTime.getMonth();
//				var date = currentTime.getDate();
//				var hours = currentTime.getHours();					
//				var minutes = currentTime.getMinutes();
//				$(".currentTime").html('当前时间：' + year + "-" + month + "-" + date + '&nbsp;' + hours + ":" + minutes); //将值赋给div
//			}
        },
        filteredBattles: function (battles) {
            var self = this;
            return battles.filter(function (battle) {
                if (self.ln_selected.length <= 0) return true;
                return $.inArray(battle.LN, self.ln_selected) !== -1;
            })
        },
        remove_match: function (index, match) {
            if ($("#tag_select").attr("value") == 10) {
              var count = $('.plan_content').children().length;

              if (count == 2) {
                var listElement = $.makeArray($('.plan_content').children()).map(function (element) {
                  return $('.tag10').find('[mid="'+ $(element).attr('mid') +'"]').get(0);
                }).filter(function (element) {
                  return $.makeArray($(element).find('.shit_now')).some(function (element) {
                    return $(element).siblings('td').find('.dg').length == 0
                  });
                });

                var currElement = $('.tag10').find('[mid="'+ match.MID +'"]').get(0);

                if (listElement.length == 2 && listElement.indexOf(currElement) >= 0) {
                  tip1('至少两场非单关玩法比赛！');
                  return;
                } else if (listElement.length == 1 && listElement.indexOf(currElement) < 0) {
                  tip1('至少选择一场单关玩法比赛');
                  return;
                }
              }

              if (count == 1) {
                tip1('至少选择一场单关玩法比赛或两场非单关玩法比赛！');
                return;
              }

            } else if ($("#tag_select").attr("value") == 15) {
              var count = $('.plan_content').children().length;

              if (count == 2) {
                var listElement = $.makeArray($('.plan_content').children()).map(function (element) {
                  return $('.tag15').find('[mid="'+ $(element).attr('mid') +'"]').get(0);
                }).filter(function (element) {
                  return $.makeArray($(element).find('.outer.shit_now')).some(function (element) {
                    return $(element).siblings('td').find('.dg').length == 0;
                  });
                });

                var currElement = $('.tag15').find('[mid="'+ match.MID +'"]').get(0);
                console.log(listElement, 'jjj');
                if (listElement.length == 2 && listElement.indexOf(currElement) >= 0) {
                  tip1('至少两场非单关玩法比赛！');
                  return;
                } else if (listElement.length == 1 && listElement.indexOf(currElement) < 0) {
                  tip1('至少选择一场单关玩法比赛');
                  return;
                }
              }

              if (count == 1) {
                tip1('至少选择一场单关玩法比赛或两场非单关玩法比赛！');
                return;
              }

            } else {
              if (this.match_selected_arr.length == 1) {
                tip1('至少选择一场单关玩法！');
                return;
              }
            }

            this.match_selected_arr.splice(index, 1);

            $(".match_info").each(function (index, ele) {
                if ($(this).attr("mid") == match.MID) {
                    $(this).find("td").removeClass("shit_now").find('span').addClass('yellow');
                    $(this).find('.t_odd').prev().html('更多>>');
                }
            });
        }
    },
    filters: {
        substr: function (val) {
            return val.substr(6, 9);
        },
        match_dg: function (val) {
            var count = 0;
            $.each(val, function (index, ele) {
                if (ele.SPF_DG == '1' | ele.RQSPF_DG == '1') {
                    count++;
                }
            });
            return count;
        },
        dayofweek: function (val) {
            var str = "";
            var week = new Date(val).getDay();
            if (week == 0) {
                str = "周日";
            } else if (week == 1) {
                str = "周一";
            } else if (week == 2) {
                str = "周二";
            } else if (week == 3) {
                str = "周三";
            } else if (week == 4) {
                str = "周四";
            } else if (week == 5) {
                str = "周五";
            } else if (week == 6) {
                str = "周六";
            }
            return str;
        }
    }
});

var thisApp = {
    init: function () {
        thisApp.actions();
        thisvue.GetBattles();
    },
    actions: function () {
        $('.publish-reduce').click(function () {
          var note = parseInt($('.publish-nums').val());

          if (note <= 1) {
            return;
          }

          note -= 1;

          if (note <= 1) {
            $(this).addClass('disabled');
          }

          if (aacount == void 0) {
            aacount = parseInt($('#zhushu').html());
          }

          $('.publish-nums').val(note);
          $('#zhushu').html(aacount * note);
          $('#zongjin').html(aacount * note * 2);
        });

        $('.publish-nums').bind('input', function () {
          var note = $(this).val();
          var res = /\D/.exec(note);
          var sectionIndex;

          if (res) {
            sectionIndex = res.index;
            $(this).val(note.replace(/\D/g, ''));
            $(this).get(0).focus();
            $(this).get(0).setSelectionRange(sectionIndex, sectionIndex);
          }
        });

        $('.publish-add').click(function () {
          var note = parseInt($('.publish-nums').val());
          note += 1;

          if (note > 1) {
            $('.publish-reduce').removeClass('disabled');
          }

          if (aacount == void 0) {
            aacount = parseInt($('#zhushu').html());
          }

          $('.publish-nums').val(note);
          $('#zhushu').html(aacount * note);
          $('#zongjin').html(aacount * note * 2);
        });

        $('#play_ul li').click(function () {
          aacount = void 0;
          $('.publish-nums').val(1);
          $('.publish-reduce').addClass('disabled');
          $(this).toggleClass('selected');
          var resultVote = [], arr = [], count = 0, profitMul = 0;

          if (!$('#play_ul').find('.selected').length) {
            $("#zhushu").html(0);
            $("#zongjin").html(0);
            $("#profit_mul").html(0);
            $("#product_profit_rate").html(0);
          } else {
            var arr = [], result = [], result_vote = [];
            $(".plan_content li").each(function (index, ele) {
                var mid = $(ele).attr("MID"), tag_val = $(ele).attr("tag_val");
                arr.push([mid, tag_val]);
            });
            $.makeArray($('#play_ul .selected')).forEach(function (element) {
              result = [];
              $.combine.cc(arr, 0, [], parseInt($(element).attr('value')), result);
              result_vote.push($.combine.get_vote(result));
            });

            result_vote = [].concat.apply([], result_vote);
            result_vote = result_vote.map(function (vote) {
              return vote.reduce(function (curr, next) {
                return [null, curr[1] * next[1]];
              })[1] * 2;
            });
            var totalB = result_vote.length * 2;
            var totalBonus = result_vote.reduce(function (curr, next) {
              return curr + next;
            }, 0);

            $("#zhushu").html(result_vote.length);
            $("#zongjin").html(result_vote.length * 2);
            $('#profit_mul').html((totalBonus / totalB).toFixed(2));
            $("#product_profit_rate").html((totalBonus / totalB).toFixed(4));
          }
        });

        $("#btn_ln_ok").click(function () {
            document.getElementById('t2').style.display = '';
            var arr = [];
            $("#searchKey .league_now").each(function (index, ele) {
                arr.push($(this).attr("value"));
            });
            thisvue.ln_selected = arr;
        });
        $("#btn_ln_all").click(function () {
            $("#searchKey div").each(function (index, ele) {
                if ($(this).hasClass("league")) {
                    $(this).removeClass("league")
                    $(this).addClass("league_now")
                }
            });
        });
        $("#btn_ln_reverse").click(function () {
            $("#searchKey div").each(function (index, ele) {
                if ($(this).hasClass("league")) {
                    $(this).removeClass("league")
                    $(this).addClass("league_now")
                } else {
                    $(this).removeClass("league_now")
                    $(this).addClass("league")
                }
            });
        });
        $("#btn_ln_top5").click(function () {
            $("#searchKey div").each(function (index, ele) {
                var top5 = ['英超', '西甲', '德甲', '意甲', '法甲'];
                if ($.inArray($(this).attr("value"), top5)!==-1) {
                    if ($(this).hasClass("league")) {
                        $(this).removeClass("league")
                        $(this).addClass("league_now")
                    }
                } else {
                    if ($(this).hasClass("league_now")) {
                        $(this).removeClass("league_now")
                        $(this).addClass("league")
                    }
                }
            });
        });
        $('.confirm-next').bind('touchstart', (function (e) {
          var $publishBtn = $('.publish');
          $publishBtn.css('pointer-events', 'none');

          this.methods.go_next();
          e.preventDefault();
          e.stopPropagation();

          setTimeout(function () {
            $publishBtn.css('pointer-events', 'all');
          }, 350);
        }).bind(this));
    },
    methods: {
        match_count: function () {
            var value = $("#tag_select").attr("value");
            var match_selected = 0;

            $(".tag" + value + " .match_info").each(function (index, ele) {
                if ($(ele).find('.shit_now').length > 0) {
                    match_selected++;
                }
            });

            $("#match_selected").html(match_selected);
        },
        cancel_selected: function (self) {
            $(self).parents('.for_self_selected').hide();
            $(self).parents('.for_self_selected').find(".shit_now").removeClass("shit_now");
            $(self).parents('.for_self_selected').find("span").addClass("yellow")
            $(self).parents(".for_self_selected").prev().html("更多>>");

            thisApp.methods.match_count();
        },
        go_next: function () {
            var value = $("#tag_select").attr("value");

            if (value == "14") {
              var $outerSelectElement = $('.tag14').find('.match_info').find('.outer.shit_now');
              var $innerSelectElement = $('.tag14').find('.t_odd').find('.shit_now');
              var isDg = !!$outerSelectElement.siblings('.red').children('.dg').length
                || !!$outerSelectElement.siblings('.yellow').children('.dg').length
                || $innerSelectElement.parents('.match_info').find('.dg').length;

              if (!isDg) {
                tip1('至少选择一场比赛');
                return;
              }

              $("#play_type").attr("value", "1.1");
              $("#play_type").html("单关");
            } else if (value == '11') {
              var $outerSelectElement = $('.tag11').find('.match_info').find('.shit_now');
              var isDg = $outerSelectElement.length;
              // var $innerSelectElement = $('.tag11').find('.t_odd').find('.shit_now');
              // var isDg = !!$outerSelectElement.siblings('.red').children('.dg').length
              //   || !!$outerSelectElement.siblings('.yellow').children('.dg').length
              //   || $innerSelectElement.parents('.match_info').find('.dg').length;

              if (!isDg) {
                tip1('至少选择一场比赛');
                return;
              }

              $("#play_type").attr("value", "1.1");
              $("#play_type").html("单关");
            } else if (value == '12') {
              var $outerSelectElement = $('.tag12').find('.match_info').find('.shit_now');
              var isDg = $outerSelectElement.length;

              if (!isDg) {
                tip1('至少选择一场比赛');
                return;
              }

              $("#play_type").attr("value", "1.1");
              $("#play_type").html("单关");
            } else if (value == '13') {
              var $outerSelectElement = $('.tag13').find('.match_info').find('.shit_now');
              var isDg = $outerSelectElement.length;

              if (!isDg) {
                tip1('至少选择一场比赛');
                return;
              }

              $("#play_type").attr("value", "1.1");
              $("#play_type").html("单关");
            } else if (value == "15") {
              var gameListElement = $('.tag15').find('.shit_now').parents('.match_info');
              var toArray = $.makeArray(gameListElement);
              //var detect = toArray.length == 1 && $(toArray[0]).find('.shit_now').siblings().find('.dg').length == 0;
              var ishh = toArray.length == 1 && $.makeArray($(toArray[0]).find('.shit_now')).some(function (ele) {
                return $(ele).siblings().find('.dg').length == 0 && $(ele).parents('.odd_title').length == 0;
              });

              if (ishh || !toArray.length) {
                  tip1("请至少选择两场比赛或选择一场单关比赛！");
                  return;
              }

              if (toArray.length == 1) {
                $("#play_type").attr("value", "1.1");
                $("#play_type").html("单关");
              } else {
                $("#play_type").attr("value", "2.1");
                $("#play_type").html("2串1");
              }
              /*var $outerSelectElement = $('.tag15').find('.match_info').find('.outer.shit_now');
              var $innerSelectElement = $('.tag15').find('.t_odd').find('.shit_now');
              var isDg = !!$outerSelectElement.siblings('.red').children('.dg').length
                || !!$outerSelectElement.siblings('.yellow').children('.dg').length
                || $innerSelectElement.parents('.match_info').find('.dg').length;

              if (!isDg
                && ($innerSelectElement.length + $outerSelectElement.parents('.match_info').length < 2
                || ($outerSelectElement.parents('.match_info').length < 2
                && $outerSelectElement.parents('.match_info').find('.t_odd').find('.shit_now').length
                && $outerSelectElement.parents('.match_info').get(0) === $innerSelectElement.parents('.match_info').get(0)
                && $('.t_odd').find('.shit_now').parents('.match_info').length < 2
                || $outerSelectElement.parents('.match_info').length + $innerSelectElement.parents('.match_info').length < 2))) {
                  tip1('不支持单关玩法，至少选择两场比赛');
                  return;
              }

              var $otherSelectElement = $outerSelectElement.filter(function () {
                return $(this).siblings('.yellow').children('.dg').length
                  || $(this).siblings('.red').children('.dg').length
              });

              if (isDg && ($otherSelectElement.length || $innerSelectElement.length) && $('.match_info').find('.outer.shit_now').not($otherSelectElement).length && ($outerSelectElement.parents('.match_info').length < 2 && $outerSelectElement.parents('.match_info').get(0) === $innerSelectElement.parents('.match_info').get(0) || $outerSelectElement.parents('.match_info').length + $innerSelectElement.parents('.match_info').length < 2)) {
                tip1('如果选择了单关和其他玩法，至少选择两场比赛');
                return;
              }
              var gameListElement = $('.tag15').find('.shit_now').parents('.match_info');
              var toArray = $.makeArray(gameListElement);

              if (toArray.length == 1) {
                $("#play_type").attr("value", "1.1");
                $("#play_type").html("单关");
              } else {
                $("#play_type").attr("value", "2.1");
                $("#play_type").html("2串1");
              }*/
            } else {
              var gameListElement = $('.tag10').find('.shit_now').parents('.match_info');
              var toArray = $.makeArray(gameListElement);
              //var detect = toArray.length == 1 && $(toArray[0]).find('.shit_now').siblings().find('.dg').length == 0;
              var ishh = toArray.length == 1 && $.makeArray($(toArray[0]).find('.shit_now')).some(function (ele) {
                return $(ele).siblings().find('.dg').length == 0;
              });

              if (ishh || !toArray.length) {
                  tip1("请至少选择两场比赛或选择一场单关比赛！");
                  return;
              }

              if (toArray.length == 1) {
                $("#play_type").attr("value", "1.1");
                $("#play_type").html("单关");
              } else {
                $("#play_type").attr("value", "2.1");
                $("#play_type").html("2串1");
              }
            }

            //
            var match_selected_arr = new Array();
            var objMatch = new Object();
            var $el = $('.match_info', '.tag' + value);
            aacount = void 0;
            $el.each(function (index, ele) {
              if ($('td.shit_now', ele).length) {
                var $parent = $(ele);
                objMatch = new Object();

                objMatch.XID = $parent.attr("XID");
                objMatch.LID = $parent.attr("LID");
                objMatch.SID = $parent.attr("SID");
                objMatch.LN = $parent.attr("LN");
                objMatch.MTIME = $parent.attr("MTIME");
                objMatch.MID = $parent.attr("MID");
                objMatch.HTEAM = $parent.attr("HTEAM");
                objMatch.ATEAM = $parent.attr("ATEAM");

                objMatch.SPF_SP3 = $parent.attr("SPF_SP3");
                objMatch.SPF_SP1 = $parent.attr("SPF_SP1");
                objMatch.SPF_SP0 = $parent.attr("SPF_SP0");
                objMatch.RQSPF_SP3 = $parent.attr("RQSPF_SP3");
                objMatch.RQSPF_SP1 = $parent.attr("RQSPF_SP1");
                objMatch.RQSPF_SP0 = $parent.attr("RQSPF_SP0");
                objMatch.LET = $parent.attr("LET");

                objMatch.SPFDG = $parent.attr("SPFDG");
                objMatch.BFDG = $parent.attr("BFDG");
                objMatch.RQSPFDG = $parent.attr("RQSPFDG");
                objMatch.JQSDG = $parent.attr("JQSDG");
                objMatch.BQCDG = $parent.attr("BQCDG");

                var tag_arr = new Array();

                $parent.find('td.shit_now').each(function (tdindex, tdele) {
                    var tag_obj = new Object();
                    tag_obj["tag_show"] = $(tdele).attr("tag_show");
                    tag_obj["tag_text"] = $(tdele).attr("tag_text");
                    tag_obj["tag_val"] = $(tdele).attr("tag_val");

                    tag_arr.push(tag_obj);
                });
                objMatch["tag_arr"] = tag_arr;
                match_selected_arr.push(objMatch);
              }
            });
            //console.log($(".tag" + value + " .match_info").length);
          //   $(".tag" + value + " .match_info").each(function (index, ele) {
          //       if ($(ele).find('td.shit_now').length > 0) {
          //   //         objMatch = new Object();
          //   //
          //   //         objMatch.XID = $(ele).attr("XID");
          //   //         objMatch.LID = $(ele).attr("LID");
          //   //         objMatch.LN = $(ele).attr("LN");
          //   //         objMatch.MTIME = $(ele).attr("MTIME");
          //   //         objMatch.MID = $(ele).attr("MID");
          //   //         objMatch.HTEAM = $(ele).attr("HTEAM");
          //   //         objMatch.ATEAM = $(ele).attr("ATEAM");
          //   //
          //   //         objMatch.SPF_SP3 = $(ele).attr("SPF_SP3");
          //   //         objMatch.SPF_SP1 = $(ele).attr("SPF_SP1");
          //   //         objMatch.SPF_SP0 = $(ele).attr("SPF_SP0");
          //   //         objMatch.RQSPF_SP3 = $(ele).attr("RQSPF_SP3");
          //   //         objMatch.RQSPF_SP1 = $(ele).attr("RQSPF_SP1");
          //   //         objMatch.RQSPF_SP0 = $(ele).attr("RQSPF_SP0");
          //   //         objMatch.LET = $(ele).attr("LET");
          //   //
          //   //         objMatch.SPFDG = $(ele).attr("SPFDG");
          //   //         objMatch.BFDG = $(ele).attr("BFDG");
          //   //         objMatch.RQSPFDG = $(ele).attr("RQSPFDG");
          //   //         objMatch.JQSDG = $(ele).attr("JQSDG");
          //   //         objMatch.BQCDG = $(ele).attr("BQCDG");
          //   //
          //   //         var tag_arr = new Array();
          //   //
          //   //         $(ele).find('td.shit_now').each(function (tdindex, tdele) {
          //   //             var tag_obj = new Object();
          //   //             tag_obj["tag_show"] = $(tdele).attr("tag_show");
          //   //             tag_obj["tag_text"] = $(tdele).attr("tag_text");
          //   //             tag_obj["tag_val"] = $(tdele).attr("tag_val");
          //   //
          //   //             tag_arr.push(tag_obj);
          //   //         });
          //   //         objMatch["tag_arr"] = tag_arr;
          //   //
          //   //         match_selected_arr.push(objMatch);
          //   //     }
          //  }});
            setTimeout(function () {
              thisvue.match_selected_arr = match_selected_arr;
            }, 0);

            $("#step1").hide();
            $("#step2").show();
        },
        go_previous: function () {
            $("#step1").show();
            $("#step2").hide();

            // var selects = Array.prototype.map.call($('.plan_box', '.plan_content'), function (element) {
            //   return $('[hteam='+ element.getAttribute('hteam') +']', '.tag15');
            // });
            //
            // var

        },
        calculate_lottery: function () {
            //统计总的选中数量
            var arr = [], result = [], result_vote = [];
            $(".plan_content li").each(function (index, ele) {
                var mid = $(ele).attr("MID"), tag_val = $(ele).attr("tag_val");
                arr.push([mid, tag_val]);
            });
            $.makeArray($('#play_ul .selected')).forEach(function (element) {
              result = [];
              $.combine.cc(arr, 0, [], parseInt($(element).attr('value')), result);
              result_vote.push($.combine.get_vote(result));
            });

            result_vote = [].concat.apply([], result_vote);
            result_vote = result_vote.map(function (vote) {
              return vote.reduce(function (curr, next) {
                return [null, curr[1] * next[1]];
              })[1] * 2;
            });
            var totalB = result_vote.length * 2;
            var totalBonus = result_vote.reduce(function (curr, next) {
              return curr + next;
            }, 0);

            $("#zhushu").html(result_vote.length);
            $("#zongjin").html(result_vote.length * 2);
            $('#profit_mul').html((totalBonus / totalB).toFixed(2));
            $("#product_profit_rate").html((totalBonus / totalB).toFixed(4));
        },
        go_bonus: function () {
          var players = $.makeArray($('#play_ul').find('.selected')).filter(function (element) {
            return element.style.display !== 'none';
          });
          var matchList = [];

          if (!players.length) {
            tip1('请选择一项串关方式');
            return;
          }

          if ((aacount == void 0 ? $('#zhushu').html() : aacount) < 1) {
            tip1('投注组合不能少于1注！');
            return;
          }

          $(".plan_content .plan_box").each(function (index, ele) {
              //$(ele).find('.shit_now')
              var objMatch_LIST = new Object();

              objMatch_LIST.XID = $(ele).attr("XID");
              objMatch_LIST.MID = $(ele).attr("MID");
              objMatch_LIST.HTEAM = $(ele).attr("HTEAM");
              objMatch_LIST.ATEAM = $(ele).attr("ATEAM");

              if ($(ele).attr('let')) {
                objMatch_LIST.LET = $(ele).attr('let');
              }

              $(ele).find('li').each(function (index, e) {
                objMatch_LIST[$(e).attr('tag_text')] = $(e).attr('tag_val');
              });

              matchList.push(objMatch_LIST);
          });

          $('#step1,#step2').hide();
          $('#step3').empty().show();


          var cgs = players.map(function (element) {
             return $(element).attr('value');
          });

          var playGroup = players.map(function (playerElement) {
            return playerElement.innerHTML;
          });

          var rootElement = $('#step3').get(0);
          Header('奖金优化', rootElement);

          var mainElement = Main(rootElement);
          bonusOptimize = BonusOptimize(
            { advList: matchList, playTypes: cgs },
            {
              playGameCount: $(".plan_content .plan_box").length,
              playGroup: playGroup, selectedProductTypeIndex: 0
            },
            mainElement
          );
        },
        getMatchList: function () {
          var list = thisvue.match_selected_arr;
          if (bonusOptimize && bonusOptimize.state) {
            var key = bonusOptimize.state.selectedProductTypeIndex === 0
              ? 'average'
              : bonusOptimize.state.selectedProductTypeIndex === 1
                ? 'hot'
                : 'cold';

            var gameList = bonusOptimize.state.bettingList[key].list;
            list = list.filter(function (item) {
              var playTypeNameValues = item.tag_arr.map(function (tag) {
                return tag.tag_text;
              });

              var getPlayTypes = [];
              gameList.forEach(function (game) {
                game.combines.forEach(function (combine) {
                  if (item['MID'] == combine['mid']
                    && playTypeNameValues.indexOf(combine['playTypeNameValue']) >= 0) {
                      if (getPlayTypes.indexOf(combine['playTypeNameValue']) < 0) {
                        getPlayTypes.push(combine['playTypeNameValue']);
                      }
                    }
                });
              });

              if (!getPlayTypes.length) {
                return false;
              } else if (getPlayTypes.length === playTypeNameValues.length) {
                return true;
              } else {
                var unno = playTypeNameValues.filter(function (item) {
                  return getPlayTypes.indexOf(item) < 0;
                });

                unno.forEach(function (playTypeName) {
                  var index = playTypeNameValues.indexOf(playTypeName);
                  item.tag_arr.splice(index, 1);
                });

                return true;
              }
            });
          }

          typeSelected = false;
          thisvue.match_selected_arr = list;

          var $curr = $('.tag' + $('#tag_select').attr('value'));
          $('.match_info', $curr).find('td').removeClass('shit_now').find('span').addClass('yellow');

          thisvue.match_selected_arr.forEach(function (match) {
            $('.match_info', $curr).each(function (index, ele) {
              var $context = $(this);

              if ($context.attr('mid') == match.MID) {
                match.tag_arr.forEach(function (tag) {
                  $context.find('td[tag_text="'+ tag.tag_text +'"]').addClass('shit_now');
                });
              }
            });
          });
        },
        go_submit: function () {
            if ($("#recomended_reason").val().length && $("#recomended_reason").val().length < 6) {
              tip1('推荐理由不少于6个字');
              return;
            }

            if ($('.gd-config').is(':visible')) {
              if ($('.fa-reason').val().length > 15) {
                tip1('方案标题不能超过15个字');
                return;
              }

              if ($('.jjfc').hasClass('selected') && $('.percent').val() != '') {
                if (parseFloat($('.percent').val()) > 15) {
                  tip1('利润分成不能大于15%');
                  return;
                }
              }
            }

            if ($('#tag_select').attr('value') == 15) {
              if ($('.plan_box', '.plan_content').length == 1) {
                var $selects = $('[hteam="'+ $('.plan_box', '.plan_content').attr('hteam') +'"]', '.tag15');
                var dgElement = $selects.find('.outer.shit_now').siblings('.yellow').children('.dg');

                if (!dgElement.length) {
                  dgElement = $selects.find('.outer.shit_now').siblings('.red').children('.dg');
                }

                var isDg = !!dgElement.length || (!!$selects.find('.dg').length && !!$selects.find('.t_odd').find('.shit_now').length);
                var spfDg = $selects.find('.yellow');
                var rqspfDg = $selects.find('.red');
                if (isDg
                  && ((!spfDg.find('.dg').length && spfDg.siblings('.outer.shit_now').length) || (!rqspfDg.find('.dg').length && rqspfDg.siblings('.outer.shit_now').length))) {
                  tip1('同时存在单关玩法和其他玩法的比赛不少于两场');
                  return;
                }

                // if (!isDg) {
                //   tip1('没有单关玩法的比赛应该不少于两场');
                //   return;
                // }
              }

            }

            var obj = new Object();//构造实体
            //构造基本信息开始-----------------------------------------------------
            obj.accessToken = $.cookie('token');// || '9cd0047c76f2491181b05bd24dc0c81b';

            if ($('#step2').is(':visible')) {
              obj.rebateRate = $('#step2').find('.lrfc').filter('.selected').hasClass('jjfc') ? $('#step2').find('.custom-lrfc').find('.selected').length ? $('#step2').find('.custom-lrfc').find('.selected').html().replace('%', '') : $('#step2').find('.percent').val() : 0;
              obj.visibleType = JSON.stringify($('#step2').find('.bmsz').filter('.selected').data('value'));
              obj.title = $('#step2').find('.fa-reason').val() || '';
            } else if ($('#step3').is(':visible')) {
              var ells = $('.betting-group:visible');
              obj.rebateRate = $(ells).find('.lrfc').filter('.selected').hasClass('jjfc') ? $(ells).find('.custom-lrfc').find('.selected').length ? $(ells).find('.custom-lrfc').find('.selected').html().replace('%', '') : $(ells).find('.percent').val() : 0;
              obj.visibleType = JSON.stringify($(ells).find('.bmsz').filter('.selected').data('value'));
              obj.title = $(ells).find('.fa-reason').val() || '';
            }

            obj.categoryId = "0001";
            obj.quantity = "2147483647";
            obj.price = 0;//$("#price_div").attr("value");
            obj.openingTime = '';//new Date().Format("yyyy-MM-dd hh:mm:ss");
//            obj.closingTime = $(".tag" + $("#tag_select").attr("value") + " .match_info").eq(0).attr("mtime");
            //var closingTimeline = Date.parse($(".plan_content .plan_box").eq(0).attr('mtime')) - 1200000;
            obj.closingTime = $(".plan_content .plan_box").eq(0).attr('mtime'); //new Date(closingTimeline).Format('yyyy-MM-dd hh:mm:ss');
            //obj.closingTime = Date.pars$(".plan_content .plan_box").eq($(".plan_content .plan_box").length-1).attr("mtime");
            //-----------------------------------------------------构造基本信息结束

            var attrArr = new Array();
            var tempObj = new Object();

            //构造期号开始-----------------------------------------------------
            tempObj.key = "EXPECT";
            tempObj.name = "EXPECT";
            tempObj.displayName = "期号";

            var expects = "";
	    var expectsArr = new Array();
            $(".tag" + $("#tag_select").attr("value") + " .match_info").each(function (index, ele) {
                if ($(ele).find('td.shit_now').length > 0) {
		    expectsArr.push($(ele).attr("expect"));
                }
            });

            tempObj.value = $.unique(expectsArr);

            attrArr.push(tempObj);
            //-----------------------------------------------------构造期号结束

            //构造彩种开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "LOTTID";
            tempObj.name = "LOTTID";
            tempObj.displayName = "彩种";
            tempObj.value = '6';
            attrArr.push(tempObj);
            //构造彩种结束-----------------------------------------------------

            //构造竞彩玩法开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "JCWF";
            tempObj.name = "JCWF";
            tempObj.displayName = "竞彩玩法";
            tempObj.value = $("#tag_select").attr("value");
            attrArr.push(tempObj);
            //构造竞彩玩法结束-----------------------------------------------------

            //构造注数开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "ZHUSHU";
            tempObj.name = "ZHUSHU";
            tempObj.displayName = "注数";

            if ($('#step3').css('display') === 'none') {
              tempObj.value = aacount != undefined ? '' + aacount : $('#zhushu').html();
            } else {
              var key = bonusOptimize.state.selectedProductTypeIndex === 0
                ? 'average'
                : bonusOptimize.state.selectedProductTypeIndex === 1
                  ? 'hot'
                  : 'cold';
              tempObj.value = '' + bonusOptimize.state.bettingList[key].noteCount;
            }

            attrArr.push(tempObj);
            //构造注数结束-----------------------------------------------------

            //构造推荐理由开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "RECOMENDED_REASON";
            tempObj.name = "RECOMENDED_REASON";
            tempObj.displayName = "推荐理由";
            tempObj.value = $("#recomended_reason").val().length < 1 ? "这家伙很懒，什么也没留下！" : $("#recomended_reason").val();
            attrArr.push(tempObj);
            //构造推荐理由结束-----------------------------------------------------

            //构造比赛场数开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "MATCH_COUNT";
            tempObj.name = "MATCH_COUNT";
            tempObj.displayName = "比赛场数";
            tempObj.value = $(".plan_content .plan_box").length.toString();
            attrArr.push(tempObj);
            //构造比赛场数结束-----------------------------------------------------

            //方案盈利倍数开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "ODDS";
            tempObj.name = "ODDS";
            tempObj.displayName = "赔率";
            tempObj.value = $("#profit_mul").html();

            attrArr.push(tempObj);
            //方案盈利倍数结束-----------------------------------------------------

            //方案盈利率开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "PRODUCT_RATE";
            tempObj.name = "PRODUCT_RATE";
            tempObj.displayName = "方案收益率";

            if ($('#step3').css('display') == 'none') {
              var resultVote = [], arr = [], result;
              $(".plan_content li").each(function (index, ele) {
                  var mid = $(ele).attr("MID"), tag_val = $(ele).attr("tag_val");
                  arr.push([mid, tag_val]);
              });

              $.makeArray($('#play_ul .selected')).forEach(function (element) {
                result = [];
                $.combine.cc(arr, 0, [], parseInt($(element).attr('value')), result);
                resultVote.push($.combine.get_vote(result));
              });

              resultVote = [].concat.apply([], resultVote);
              resultVote = resultVote.map(function (vote) {
                return Math.floor(10000 / (vote.reduce(function (curr, next) {
                  return [null, curr[1] * next[1]];
                })[1] * 2));
              });
              var profitRate = ((10000 / (resultVote.reduce(function (curr, next) {
                return curr + next;
              }) * 2) * 100)).toFixed(2) + '%';
            } else {
              var key = bonusOptimize.state.selectedProductTypeIndex === 0
                ? 'average'
                : bonusOptimize.state.selectedProductTypeIndex === 1
                  ? 'hot'
                  : 'cold';

              var resultVote = bonusOptimize.state.bettingList[key].list.map(function (vote) {
                return Math.floor( 10000 / (vote.rateProduct * 2));
              });
              var profitRate = ((10000 / (resultVote.reduce(function (curr, next) {
                return curr + next;
              }) * 2) * 100)).toFixed(2) + '%';
            }

            //var profitRate = (Number($("#product_profit_rate").html()) * 100).toFixed(2) + '%';
            tempObj.value = profitRate ;
            attrArr.push(tempObj);
            //方案盈利率结束-----------------------------------------------------

            //构造联赛开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "LEAGUES";
            tempObj.name = "LEAGUES";
            tempObj.displayName = "联赛";

            var leagueArr = new Array();
            $(".plan_content .plan_box").each(function (index, ele) {
                leagueArr.push($(ele).attr("LID"));
            });

            tempObj.value = $.unique(leagueArr);
            attrArr.push(tempObj);
            //构造联赛结束-----------------------------------------------------

            //构造比赛信息开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "MATCH_LIST";
            tempObj.name = "MATCH_LIST";
            tempObj.displayName = "比赛信息";

            var attrMatch_LIST = new Array();
            var objMatch_LIST = new Object();
            $(".plan_content .plan_box").each(function (index, ele) {
                //$(ele).find('.shit_now')
                objMatch_LIST = new Object();

                objMatch_LIST.XID = $(ele).attr("XID");
                objMatch_LIST.MID = $(ele).attr("MID");
                objMatch_LIST.LID = $(ele).attr("LID");
                objMatch_LIST.SID = $(ele).attr("SID");
                objMatch_LIST.LN = $(ele).attr("LN");
                objMatch_LIST.MTIME = $(ele).attr("MTIME");
                objMatch_LIST.HTEAM = $(ele).attr("HTEAM");
                objMatch_LIST.ATEAM = $(ele).attr("ATEAM");

                //if ($('.match_info', '.tag15').)

                if ($("#tag_select").attr("value") == 15 || $("#tag_select").attr("value") == 14) {
                  if ($('#tag_select').attr('value') == 14) {
                    var $el = $('.match_info', '.tag14').filter('[hteam="'+ $(ele).attr('hteam') +'"]');
                  } else {
                    var $el = $('.match_info', '.tag15').filter('[hteam="'+ $(ele).attr('hteam') +'"]');
                  }


                  if ($el.find('.outer.shit_now').length) {
                    objMatch_LIST.SPF_SP3 = $(ele).attr("SPF_SP3");
                    objMatch_LIST.SPF_SP1 = $(ele).attr("SPF_SP1");
                    objMatch_LIST.SPF_SP0 = $(ele).attr("SPF_SP0");
                    objMatch_LIST.RQSPF_SP3 = $(ele).attr("RQSPF_SP3");
                    objMatch_LIST.RQSPF_SP1 = $(ele).attr("RQSPF_SP1");
                    objMatch_LIST.RQSPF_SP0 = $(ele).attr("RQSPF_SP0");
                  }
                } else {
                  objMatch_LIST.SPF_SP3 = $(ele).attr("SPF_SP3");
                  objMatch_LIST.SPF_SP1 = $(ele).attr("SPF_SP1");
                  objMatch_LIST.SPF_SP0 = $(ele).attr("SPF_SP0");
                  objMatch_LIST.RQSPF_SP3 = $(ele).attr("RQSPF_SP3");
                  objMatch_LIST.RQSPF_SP1 = $(ele).attr("RQSPF_SP1");
                  objMatch_LIST.RQSPF_SP0 = $(ele).attr("RQSPF_SP0");
                }

                objMatch_LIST.LET = $(ele).attr("LET");

                attrMatch_LIST.push(objMatch_LIST);
            });

            tempObj.value = attrMatch_LIST;
            attrArr.push(tempObj);
            //构造比赛信息结束-----------------------------------------------------

            //构造方案信息开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "ADV_LIST";
            tempObj.name = "ADV_LIST";
            tempObj.displayName = "方案内容";
            tempObj.needPurchase = "1";

            var attrADV_LIST = new Array();
            var objADV_LIST = new Object();

            $(".plan_content .plan_box").each(function (index, ele) {
                objADV_LIST = new Object();

                objADV_LIST.XID = $(ele).attr("XID");
                objADV_LIST.MID = $(ele).attr("MID");
                objADV_LIST.HTEAM = $(ele).attr("HTEAM");
                objADV_LIST.ATEAM = $(ele).attr("ATEAM");

                if ($(ele).attr('let')) {
                  objADV_LIST.LET = $(ele).attr('let');
                }


                $(ele).find('li').each(function (tdindex, tdele) {
                    objADV_LIST[$(tdele).attr("tag_text")] = $(tdele).attr("tag_val");
                });

                attrADV_LIST.push(objADV_LIST);
            });
            tempObj.value = attrADV_LIST;
            attrArr.push(tempObj);
            //构造方案信息结束-----------------------------------------------------

            //构造玩法开始-----------------------------------------------------
            tempObj = new Object();
            tempObj.key = "PLAY_TYPE";
            tempObj.name = "PLAY_TYPE";
            tempObj.displayName = "玩法";

            var playTypeArr = new Array();
            $('#play_ul .selected').each(function (_, element) {
              playTypeArr.push($(element).attr('value'));
            });
            tempObj.value = playTypeArr;
            attrArr.push(tempObj);

            tempObj = {
              key: 'MULTIPLE',
              name: 'MULTIPLE',
              displayName: '倍数',
              value: $('#step3').css('display') === 'none' ? $('.publish-nums').val() : '1'
            };
            attrArr.push(tempObj);

            //构造玩法结束-----------------------------------------------------
            tempObj = {
              key: 'PRODUCT_COMBINE',
              name: 'PRODUCT_COMBINE',
              displayName: '方案拆单'
            };
            var combineTypeArr, arr = [], result = [];

            if ($('#step3').css('display') === 'none') {
              combineTypeArr = [];
            } else {
              var key = bonusOptimize.state.selectedProductTypeIndex === 0
                ? 'average'
                : bonusOptimize.state.selectedProductTypeIndex === 1
                  ? 'hot'
                  : 'cold';
              combineTypeArr = bonusOptimize.state.bettingList[key].list;
            }


            tempObj.value = combineTypeArr;
            attrArr.push(tempObj);
            console.log(obj);
            obj.attributes = attrArr;
            $("#loading").show();
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: '/products/add',
                data: JSON.stringify(obj),
                success: function (result) {
                    if (result.errcode == "0") {
                        tip2("方案发布成功！", "方案号：" + result.data.data);
                    } else {
                        tip1(result.errmsg);
                    }

                    if (result.errcode == "700003") {
                        goAPP("login");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    tip1("异常！" + textStatus + ":" + errorThrown);
                },
                complete: function () {
                    $("#loading").hide();
                }
            });
        }
    }
}

if ($.cookie('token') && localStorage.getItem('token') == $.cookie('token')) {
  setVip();
}

function setVip () {
  if (!localStorage.getItem('isVip')) {
    $.ajax({
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      url: '/users/detail',
      data: JSON.stringify({ accessToken: $.cookie('token') }),
      success: function (data) {
        if (data.errcode != 0) {
          tip1(data.errmsg);
          isVip = false;
          localStorage.setItem('isVip', false);
          $('.gd-config').hide();
          return;
        }

        if (data.data.detail.vip == 1) {
          isVip = true;
          localStorage.setItem('isVip', true);
          $('.gd-config').show();
        }
      },
      error: function () {
        isVip = false;
        localStorage.setItem('isVip', false);
        $('.gd-config').hide();
        tip1('网络发生异常');
      }
    });
  } else {
    isVip = JSON.parse(localStorage.getItem('isVip'));

    if (isVip) {
      $('.gd-config').show();
    } else {
      $('.gd-config').hide();
    }
  }
}

function kdj () {
  $(this).addClass('selected').siblings('.kdj').removeClass('selected');

  if ($(this).hasClass('lrfc')) {
    if ($(this).hasClass('jjfc')) {
      $('.custom-lrfc').show();
    } else {
      $('.custom-lrfc').hide();
    }
  }

  if ($(this).hasClass('pencent-v')) {
    $('.percent').val('');
  }
}

function print () {
  if ($(this).val() != '') {
    if ($(this).val().charAt(0) != '.') {
      $(this).parents('.gd-config').find('.custom-lrfc').find('.pencent-v').removeClass('selected');
    } else {
      $(this).val('');
    }
  } else {
    !$(this).parents('.gd-config').find('.custom-lrfc').find('.selected').length && $(this).parents('.gd-config').find('.custom-lrfc').find('.pencent-v').first().addClass('selected');
  }
}

$(function () {
    thisApp.init();

    $('.kdj').click(function () {
      kdj.call(this);
    });

    $('.percent').on('input', function () {
      print.call(this);
    });
});
