window.InputAmount = function (amount, onModifyAmount, onSubmitAmount) {
  var config = {
    className: 'modal',
    childrens: [{
      className: 'input-amount',
      childrens: [{
        className: 'buy',
        childrens: [{
          tagName: 'span',
          className: 'buy-money-box',
          childrens: [{
            tagName: 'input',
            prop: { placeholder: '请输入金额', value: amount, type: 'tel' },
            className: 'buy-money'
          }]
        }, {
          tagName: 'span',
          className: 'buy-text buy-right',
          childrens: '元'
        }]
      }]
    }],
    handlers: [{
      selector: '.modal',
      eventName: 'touchstart',
      handles: {
        'modal': function (element, e) {
          if (this._getParent('.input-amount', e.target)) {
            return;
          }

          element.parentNode.removeChild(element);
          onSubmitAmount();
        }
      }
    }, {
      selector: '.buy-money',
      eventName: 'input',
      handles: {
        'buy-money': function (element, e) {
          onModifyAmount(element);
        }
      }
    }]
  };

  return NB(config)
    .use(function init () {
      this.findElements('.buy-money-box')[0].style['flex'] = '0 0 3rem';  
    })
    .finish(document.body)
    .element;
};
