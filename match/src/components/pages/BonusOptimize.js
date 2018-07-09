window.BonusOptimize = function (postData, state, parentElement) {
  var currentAction, bettingListTabElement, scrollTop;

  function getAllPromise (principal) {
    return [
      new Promise(function (resolve) {
        $.ajax(buildFetchParam(1, principal, function (res) { resolve(res) }))
      }),
      new Promise(function (resolve) {
        $.ajax(buildFetchParam(2, principal, function (res) { resolve(res) }))
      }),
      new Promise(function (resolve) {
        $.ajax(buildFetchParam(3, principal, function (res) { resolve(res) }))
      })
    ];
  }

  function fetchBonus (promises) {
    return Promise.all(promises);
  }

  function buildFetchParam (optimizeType, principal, success) {
    return {
      type: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      processData: false,
      dataType: 'json',
      url: '/product/combine',
      data: JSON.stringify($.extend(postData, { principal: principal, optimizeType: optimizeType })),
      success: success
    };
  }

  function initPartial (element, data) {
    var key = this.state.selectedProductTypeIndex === 0
      ? 'average'
      : this.state.selectedProductTypeIndex === 1
        ? 'hot'
        : 'cold';
    var copy = $.extend({}, this.state.bettingList[key], {
      code: data.errcode,
      amount: data.data.schemes.principal,
      noteCount: data.data.schemes.totalNote,
      list: data.data.schemes.products
    });

    this.state.bettingList[key] = copy;

    setState($.extend(this.state), element);
  }

  function init (element, _, data) {
    var average = {
      code: data[0].errcode,
      noteCount: data[0].errcode != '730001' ? data[0].data.schemes.totalNote : 0,
      amount: data[0].errcode != '730001' ? data[0].data.schemes.principal : 0,
      list: data[0].errcode != '730001' ? data[0].data.schemes.products : []
    };
    var hot = {
      code: data[1].errcode,
      noteCount: data[1].errcode != '730001' ? data[1].data.schemes.totalNote : 0,
      amount: data[1].errcode != '730001' ? data[1].data.schemes.principal : 0,
      list: data[1].errcode != '730001' ? data[1].data.schemes.products : []
    };
    var cold = {
      code: data[2].errcode,
      noteCount: data[2].errcode != '730001' ? data[2].data.schemes.totalNote : 0,
      amount: data[2].errcode != '730001' ? data[2].data.schemes.principal : 0,
      list: data[2].errcode != '730001' ? data[2].data.schemes.products : []
    };

    $.extend(state, {
      bettingList: {
        'average': average,
        'hot': hot,
        'cold': cold
      }
    });

    this['amount'] = {
      element: element,
      value: average.amount
    };
    setState(this.state = state, element);
  }

  function setState (state, element) {
    if (bettingListTabElement) {
      scrollTop = bettingListTabElement
        .querySelectorAll('.betting-group')[state.selectedProductTypeIndex]
        .querySelector('.betting-group-inner')
        .scrollTop;
    }

    element.innerHTML = '';

    var key = state.selectedProductTypeIndex === 0
      ? 'average'
      : state.selectedProductTypeIndex === 1
        ? 'hot'
        : 'cold';

    // 显示选择比赛
    createChooseGame(state.playGameCount, state.playGroup, element);
    // 显示计划购买金额
    createPlanMoney(state.bettingList[key].amount, element);
    // 显示方案种类
    createProductType(state.selectedProductTypeIndex, element);
    // 显示投注组合列表
    bettingListTabElement = createBettingListTab(state.bettingList, element);

    var bettingListGroupElements = bettingListTabElement.querySelectorAll('.betting-group');
    var bettingListGroupElement;

    $.makeArray(bettingListGroupElements).forEach(function (ele) {
      ele.style.display = 'none';
    });

    (bettingListGroupElement = bettingListGroupElements[state.selectedProductTypeIndex])
      && (bettingListGroupElement.style.display = 'flex');

    if (scrollTop) {
      bettingListTabElement
        .querySelectorAll('.betting-group')[state.selectedProductTypeIndex]
        .querySelector('.betting-group-inner')
        .scrollTop = scrollTop;
    }
  }

  function createCalcNumsHandle (attr, callback) {
    return function (numsElement) {
      attr && (numsElement = numsElement[attr]);

      this['note'] = {
        value: callback(parseInt(numsElement.value)),
        element: numsElement
      };

      var groupElement = this.findElements('.betting-group')[this.state.selectedProductTypeIndex];
      var itemElements = this.findElements.call({ element: groupElement }, '.betting-item');
      var item = this._getParent('.betting-item', numsElement);
      var index = itemElements.indexOf(item);
      var key = this.state.selectedProductTypeIndex === 0
        ? 'average'
        : this.state.selectedProductTypeIndex === 1
          ? 'hot'
          : 'cold';
      var combineGroup = this.state.bettingList[key].list[index];
      var bonus = combineGroup.combines.reduce(function (curr, next) {
        return {
          playRate: parseFloat(curr.playRate) * parseFloat(next.playRate)
        };
      }).playRate * this['mnote'] * 2;
      var copy = $.extend({}, combineGroup, {
        note: this['mnote'],
        bonus: bonus.toFixed(2)
      });

      currentAction = '';
      this.state.bettingList[key].list.splice(index, 1, copy);
      var noteCount = this.state.bettingList[key].list.reduce(function (curr, next) {
        return { note: parseFloat(curr.note) + parseFloat(next.note) }
      }, { note: 0 }).note;
      this.state.bettingList[key].noteCount = noteCount;
      this.state.bettingList[key].amount = noteCount * 2;
      this['amount'] = {
        value: noteCount * 2
      };
      setState($.extend({}, this.state), this.element);
    };
  }

  var bonusOptimize = NB({
    id: 'bonus_optimize',
    className: 'bonus-optimize',
    changes: [{
      model: 'amount',
      domKey: 'value',
      handle: function (_, value) {
        value = '' + value;
        var moneyRE = /^([\d\.]*?)$/;
        var charCode = value.charAt(0).charCodeAt();
        var matchDots = value.match(/\./g);

        if (charCode < 48 || charCode > 57) {
          // 如果首位字符不是数字
          return '';
          //element.value = '';
        } else if (!moneyRE.test(value) || (matchDots && matchDots.length > 1)) {
          // 如果后续输入的不是数字或输入的小数点多1个或偶数
          return parseFloat(value.slice(0, -1));
        } else {
          return parseFloat(value);
        }
      }
    }, {
      model: 'note',
      domKey: 'value',
      handle: function (numsElement, nums) {
        var numRE = /^\d*?$/;
        var isMached = nums && numRE.test(nums);
        var reduceElement = numsElement.previousElementSibling;

        if (isMached) {
          if (nums < 2) {
            reduceElement.classList.add('disabled');
            reduceElement.setAttribute('disabled', true);
          } else {
            reduceElement.classList.remove('disabled');
            reduceElement.removeAttribute('disabled');
          }
        }

        return !isMached
          ? nums
            ? nums.slice(0, -1)
            : 1
          : nums;
      }
    }],
    handlers: [{
      selector: '.choosebox-nums',
      eventName: 'input',
      handles: {
        'choosebox-nums': createCalcNumsHandle(null, function (nums) {
          return nums;
        })
      }
    }, {
      selector: '.average .focus-abled .bonus-submit .bot-hot .bot-cold .betting-delete .choosebox-reduce .choosebox-add',
      eventName: 'touchstart',
      handles: {
        'focus-abled': function (element) {
          console.log(this['amount'], 'mmm')
          InputAmount(this['amount'] || element.value, (function (amountElement) {
            var amount = amountElement.value;
            if (!amount.length) {
              this['amount'] = {
                element: amountElement,
                value: 0
              };
              element.value = amountElement.value;
            } else {
              this['amount'] = {
                 element: amountElement,
                 value: amount
              };
              element.value = amountElement.value = this['amount'];
            }
          }).bind(this), (function () {
            var context = this;

            if (context['amount'] % 2 != 0) {
              Modal('金额不支持基数', false);

              var key = context.state.selectedProductTypeIndex === 0
                ? 'average'
                : context.state.selectedProductTypeIndex === 1
                  ? 'hot'
                  : 'cold';
              context['amount'] = {
                value: context.state.bettingList[key].amount
              };
              element.value = context.state.bettingList[key].amount;

              return;
            }

            fetchBonus([
              new Promise(function (resolve) {
                var optimizeType = context.state.selectedProductTypeIndex + 1;
                $.ajax(buildFetchParam(optimizeType, context['amount'], function (res) { resolve(res) }))
              })
            ]).then(function (data) {
              if (data[0].errcode == 0) {
                initPartial.call(context, context.element, data[0]);
              } else {
                throw new Error(data[0].errmsg);
              }
            }).catch(function (error) {
              var amountMatch = /\d+/.exec(error.message);

              Modal(error.message, false, null, function () {
                fetchBonus([
                  new Promise(function (resolve) {
                    var optimizeType = context.state.selectedProductTypeIndex + 1;
                    $.ajax(buildFetchParam(optimizeType, context['amount'], function (res) { resolve(res) }))
                  })
                ]).then(function (data) {
                  initPartial.call(context, context.element, data[0]);
                });
              });

              if (amountMatch) {
                context['amount'] = {
                  value: amountMatch[0]
                };

                element.value = context['amount'];
              }
            });
          }).bind(this));
        },
        'bonus-submit': function () {
          thisApp.methods.go_submit();
        },
        'average': function () {
          currentAction = '';
          var context = this;
          $.extend(this.state, { selectedProductTypeIndex: 0 });

          fetchBonus([
            new Promise(function (resolve) {
              $.ajax(buildFetchParam(1, context['amount'], function (res) { resolve(res) }))
            })
          ]).then(function (data) {
            if (data[0].errcode == 0) {
              initPartial.call(context, context.element, data[0]);
            } else {
              throw new Error(data[0].errmsg);
            }
          }).catch(function (error) {
            Modal(error.message, false);
          });
        },
        'bot-hot': function () {
          if (!this.state.bettingList.hot.list.length) {
            setTimeout(function () {
              $('#t6').css('pointer-events', 'auto');
            }, 500);
            $('#t6').css('pointer-events', 'none');
            tip1('博热保本不存在投注组合');
          } else {
            currentAction = '';
            var context = this;
            $.extend(this.state, { selectedProductTypeIndex: 1 });

            fetchBonus([
              new Promise(function (resolve) {
                $.ajax(buildFetchParam(2, context['amount'], function (res) { resolve(res) }))
              })
            ]).then(function (data) {
              if (data[0].errcode == 0) {
                initPartial.call(context, context.element, data[0]);
              } else {
                throw new Error(data[0].errmsg);
              }
            }).catch(function (error) {
              Modal(error.message, false);
            });
          }
        },
        'bot-cold': function () {
          if (!this.state.bettingList.cold.list.length) {
            setTimeout(function () {
              $('#t6').css('pointer-events', 'auto');
            }, 500);
            $('#t6').css('pointer-events', 'none');
            tip1('不支持博冷优化');
          } else {
            currentAction = '';
            var context = this;

            $.extend(this.state, { selectedProductTypeIndex: 2 });
            fetchBonus([
              new Promise(function (resolve) {
                $.ajax(buildFetchParam(3, context['amount'], function (res) { resolve(res) }))
              })
            ]).then(function (data) {
              if (data[0].errcode == 0) {
                initPartial.call(context, context.element, data[0]);
              } else {
                throw new Error(data[0].errmsg);
              }
            }).catch(function (error) {
              Modal(error.message, false);
            });
          }
        },
        'betting-delete': function (element) {
          currentAction = '';
          var context = this;
          var key = context.state.selectedProductTypeIndex === 0
            ? 'average'
            : context.state.selectedProductTypeIndex === 1
              ? 'hot'
              : 'cold';

          if (context.state.bettingList[key].list.length < 2) {
            Modal('投注组合不能少于1注！', false);
            return;
          }

          Modal('你确定要删除该组合吗？', true, function () {
            var groupElement = context.findElements('.betting-group')[context.state.selectedProductTypeIndex];
            var itemElements = context.findElements.call({ element: groupElement }, '.betting-item');
            var item = context._getParent('.betting-item', element);
            var index = itemElements.indexOf(item);

            context.state.bettingList[key].list.splice(index, 1);
            var noteCount = context.state.bettingList[key].list.reduce(function (curr, next) {
              return { note: parseFloat(curr.note) + parseFloat(next.note) }
            }, { note: 0 }).note;

            context.state.bettingList[key].noteCount = noteCount;
            context.state.bettingList[key].amount = noteCount * 2;

            context['amount'] = {
              value: noteCount * 2
            };

            setState($.extend({}, context.state), context.element);
            thisApp.methods.getMatchList();
          });
        },
        'choosebox-reduce': createCalcNumsHandle('nextElementSibling', function (nums) {
          return --nums;
        }),
        'choosebox-add': createCalcNumsHandle('previousElementSibling', function (nums) {
          return ++nums;
        })
      }
    }]
  })
  .use(function loading (_, next) {
    $('#loading').show();
    next();
  })
  .use(function fetchData(_, next) {
    fetchBonus(getAllPromise(1000)).then(function (data) {
      $('#loading').hide();
      next(data);
    });
  })
  .use(init)
  .finish(parentElement);


  // 创建选择比赛组件
  function createChooseGame (gameCount, gameGroup, bonusOptimizeElement) {
    var config = {
      id: 'choose_game',
      className: 'choose-game',
      childrens: [{
        tagName: 'span',
        className: 'choose-game-count',
        childrens: '已选' + gameCount + '场比赛'
      }, {
        tagName: 'span',
        className: 'choose-game-type',
        childrens: gameGroup.join(' ')
      }]
    };

    return NB(config).finish(bonusOptimizeElement).element;
  }

  // 创建计划金额组件
  function createPlanMoney (amount, bonusOptimizeElement) {
    var config = {
      id: 'buy',
      className: 'buy',
      childrens: [{
        tagName: 'span',
        className: 'buy-text buy-left',
        childrens: '计划购买金额'
      }, {
        tagName: 'span',
        className: 'buy-money-box',
        childrens: [{
          tagName: 'input',
          prop: { placeholder: '请输入金额', value: amount, type: 'tel' },
          className: 'buy-money focus-abled'
        }]
      }, {
        tagName: 'span',
        className: 'buy-text buy-right',
        childrens: '元'
      }]
    };

    return NB(config)
      .use(function setSelectionRange () {
        if (currentAction === 'money') {
          var amountElement = this.findElements('.buy-money')[0];
          var textLength = ('' + amount).length;

          amountElement.focus();
          amountElement.setSelectionRange(textLength, textLength);
        }
      })
      .finish(bonusOptimizeElement)
      .element;
  }

  // 创建方案种类组件
  function createProductType (selectedProductTypeIndex, bonusOptimizeElement) {
    var config = {
      tagName: 'ul',
      className: 'product-type',
      childrens: [{
        tagName: 'li',
        className: 'average selected product-type-item',
        childrens: [{
          tagName: 'header',
          childrens: [{
            tagName: 'span',
            className: 'prefix',
            childrens: [{
              tagName: 'i'
            }]
          }, {
            tagName: 'span',
            childrens: '平均优化'
          }]
        }]
      }, {
        tagName: 'li',
        className: 'bot-hot product-type-item',
        childrens: [{
          tagName: 'header',
          childrens: [{
            tagName: 'span',
            className: 'prefix',
            childrens: [{
              tagName: 'i'
            }]
          }, {
            tagName: 'span',
            childrens: '博热保本'
          }]
        }]
      }, {
        tagName: 'li',
        className: 'bot-cold product-type-item',
        childrens: [{
          tagName: 'header',
          childrens: [{
            tagName: 'span',
            className: 'prefix',
            childrens: [{
              tagName: 'i'
            }]
          }, {
            tagName: 'span',
            childrens: '博冷保本'
          }]
        }]
      }]
    };

    return NB(config)
      .use(function () {
        var items = this.findElements('.product-type-item');
        items.forEach(function (item) {
          item.classList.remove('selected');
        });
        items[selectedProductTypeIndex].classList.add('selected');
      })
      .finish(bonusOptimizeElement).element;
  }

  // 创建组合列表tab组件
  function createBettingListTab (bettingList, bonusOptimizeElement) {
    return NB({
      className: 'betting-group-tab'
    })
    .use(function (element) {
      Object.keys(bettingList).forEach(function (betting) {
        if (bettingList[betting].code != '730001') {
          createBettingList(bettingList[betting].list, bettingList[betting].noteCount, element);
        }
      });
    })
    .finish(bonusOptimizeElement).element;
  }

  // 创建投注组合列表组件
  function createBettingList (bettingGroup, noteCount, bonusOptimizeElement) {
    var config = {
      tagName: 'ul',
      className: 'betting-group'
    };

    return NB(config)
      .use(function render (element) {
        var context = this;
        var inner = NB({
          className: 'betting-group-inner'
        }).finish(element).element;

        var bettingListItemStrings = bettingGroup.map(function (item) {
          createBettingListItem(item.combines, item.bonus, item.note, inner);
        });

        var gdConfigEl = NB({
          className: 'con'
        }).finish(element).element;
        gdConfigEl.innerHTML = $('#gd_temp').html();

        if (!isVip) {
          gdConfigEl.style.display = 'none';
          //$(gdConfigEl).hide();
        } else {
          gdConfigEl.style.display = 'block';
          //$(gdConfigEl).show();
        }

        $(gdConfigEl).find('.kdj').click(function () {
          kdj.call(this);
        });

        $(gdConfigEl).find('.percent').on('input', function () {
          print.call(this);
        });

        createNote(noteCount, element);
      })
      .finish(bonusOptimizeElement)
      .element;
  }

  // 创建投注项组件
  function createBettingListItem (games, initMoney, note, bonusOptimizeElement) {
    var config = {
      tagName: 'li',
      className: 'betting-item',
      childrens: [{
        tagName: 'header',
        childrens: [{
          className: 'betting-name',
          childrens: [{
            tagName: 'span',
            childrens: '投注组合'
          }]
        }, {
          className: 'betting-delete',
          childrens: [{
            tagName: 'span',
            childrens: '删除'
          }]
        }]
      }, {
        tagName: 'section',
        childrens: [{
          tagName: 'ul',
          className: 'betting-list'
        }, {
          className: 'betting-bonus',
        }, {
          className: 'betting-fold',
          childrens: [{
            className: 'betting-fold-inner',
            childrens: [{
              tagName: 'span',
              childrens: '选择注数'
            }, {
              childrens: ChooseBox(note)
            }]
          }]
        }]
      }, {
        tagName: 'footer',
        childrens: [{
          tagName: 'span',
          childrens: '奖金'
        }, {
          tagName: 'span',
          className: 'amount',
          childrens: initMoney
        }, {
          tagName: 'span',
          childrens: '元'
        }]
      }]
    };

    return NB(config)
    .use(function render (element, next) {
      var context = this;
      var bettingBonusElement = this.findElements('.betting-bonus')[0];
      var bettingListElement = this.findElements('.betting-list')[0];
      var childrens = games.map(function (game) {
        return context._parseElementToString(NB({
          tagName: 'li',
          className: 'row',
          childrens: [{
            tagName: 'span',
            className: 'column team',
            childrens: game.hTeam
          }, {
            tagName: 'span',
            className: 'column sit',
            childrens: game.playTypeValue
          }, {
            tagName: 'span',
            className: 'column play',
            childrens: game.playRate
          }]
        }).finish().element)
      });
      var singleBonus = games.reduce(function (curr, next) {
        return {
          playRate: curr.playRate * next.playRate
        }
      }).playRate * 2;

      bettingBonusElement.innerHTML = singleBonus.toFixed(2) + '元/注';
      bettingListElement.insertAdjacentHTML('beforeend', childrens.join(''));
    })
    .finish(bonusOptimizeElement);
  }

  // 创建注数组件
  function createNote(note, bonusOptimizeElement) {
    postData['optimizeType'] = 1;

    var config = {
      tagName: 'footer',
      className: 'bonus-footer',
      childrens: [{
        className: 'bonus-noteamount',
        childrens: [{
            tagName: 'span',
            className: 'bonus-note-total',
            childrens: note
          }, {
            tagName: 'small',
            childrens: '注'
          }, {
            tagName: 'span',
            className: 'bonus-amount-total',
            childrens: note * 2
          }, {
            tagName: 'small',
            childrens: '元'
          }]
      }, {
        tagName: 'span',
        className: 'bonus-submit',
        childrens: '保存'
      }]
    };

    return NB(config).finish(bonusOptimizeElement).element;
  }

  return bonusOptimize;
}
