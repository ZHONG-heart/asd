window.Main = function (rootElement) {
  var config = {
    tagName: 'section',
    className: 'main'
  };
  return NB(config).finish(rootElement).element;
};
