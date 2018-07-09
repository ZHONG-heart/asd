window.ChooseBox = function (note) {
  var config = {
    className: 'choosebox',
    childrens: [{
      tagName: 'button',
      className: 'choosebox-reduce',
      childrens: '-'
    }, {
      tagName: 'input',
      prop: { value: note, type: 'tel' },
      className: 'choosebox-nums'
    }, {
      tagName: 'button',
      className: 'choosebox-add',
      childrens: '+'
    }]
  };

  return NB(config)
    .use(function (element, next) {
      // 默认禁用减
      if (note === 1) {
        var reductElement = this.findElements('.choosebox-reduce')[0];
        reductElement.classList.add('disabled');
        reductElement.setAttribute('disabled', true);  
      }
    })
    .finish()
    .element;
};
