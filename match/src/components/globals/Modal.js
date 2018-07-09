window.Modal = function (textContent, isFooter, handleOk, handleOther) {
  function handleCancel () {
    this.parentNode.removeChild(this);
  }

  var config = {
    className: 'modal',
    childrens: [{
      className: 'modal-inner',
      childrens: [{
        tagName: 'section',
        className: 'modal-exp'
      }, {
        tagName: 'footer',
        className: 'modal-action',
        childrens: [{
          tagName: 'button',
          className: 'modal-ok',
          childrens: '确定'
        }, {
          tagName: 'button',
          className: 'modal-cancel',
          childrens: '取消'
        }]
      }]
    }],
    handlers: [{
      selector: '.modal-cancel .modal-ok .modal',
      eventName: 'touchstart',
      handles: {
        'modal': function (element) {
          handleCancel.call(element);
          handleOther && handleOther();
        },
        'modal-cancel': function () {
          handleCancel.call(this.element);
          handleOther && handleOk();
        },
        'modal-ok': function () {
          handleCancel.call(this.element);
          handleOk && handleOk()
        }
      }
    }]
  };

  return NB(config)
    .use(function (element) {
      this.findElements('.modal-exp')[0].textContent = textContent;

      if (!isFooter) {
        var currElement = this.findElements('.modal-action')[0];
        currElement.parentNode.removeChild(currElement);
      }
    })
    .finish(document.body)
    .element;
};
