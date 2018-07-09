window.Header = function (text, rootElement) {
  var config = {
    tagName: 'header',
    className: 'header-top',
    childrens: [{
      className: 'header-inner',
      childrens: [{
          id: 'back',
          className: 'back',
          childrens: '返回'
        }, {
          className: 'header-content',
          childrens: text
        }]
    }],
    handlers: [{
      selector: '#back',
      eventName: 'touchstart',
      handles: {
        'back': function (_, e) {
          $("#step2").show();
          $("#step1").hide();
          $("#step3").hide();
          e.preventDefault();
        }
      }
    }]
  };

  NB(config).finish(rootElement);
};
