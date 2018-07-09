'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var secret = {
  config: 'componentConfig'
};
var matchPropRE = /([a-z"]+):/gi;

var Nb = function () {
  function Nb(config) {
    _classCallCheck(this, Nb);

    this[secret.config] = this._validateConfig(config);
    this.middlewareIndex = 0;
  }

  _createClass(Nb, [{
    key: '_validateConfig',
    value: function _validateConfig(config) {
      var copy = _extends({}, config);

      copy.tagName != null || (copy.tagName = 'div');
      copy.id != null || (copy.id = '');
      copy.className != null || (copy.className = '');
      copy.prop != null || (copy.prop = {});
      copy.childrens != null || (copy.childrens = []);
      copy.changes != null || (copy.changes = []);
      copy.middlewares != null || (copy.middlewares = []);
      copy.handlers != null || (copy.handlers = []);

      return copy;
    }
  }, {
    key: '_parsePropToString',
    value: function _parsePropToString(prop) {
      return JSON.stringify(prop).replace(matchPropRE, '$1=').replace(/"([\w-]+)"=/g, '$1=').replace(/[{}]/g, '').replace(/,/g, ' ');
    }
  }, {
    key: '_parseElementToString',
    value: function _parseElementToString(element) {
      var parent = document.createElement('div');
      parent.appendChild(element);

      return parent.innerHTML;
    }
  }, {
    key: '_checkElement',
    value: function _checkElement(obj) {
      return HTMLElement.prototype.isPrototypeOf(obj);
    }
  }, {
    key: '_buildElement',
    value: function _buildElement(_ref) {
      var _this = this;

      var tagName = _ref.tagName,
          id = _ref.id,
          className = _ref.className,
          prop = _ref.prop,
          childrens = _ref.childrens;

      var traversal = function traversal(childrens) {
        if (childrens instanceof Array) {
          return childrens.map(function (child) {
            return traversal(child);
          });
        } else {
          childrens = _this._validateConfig(childrens);

          if (childrens.childrens instanceof Array) {
            return '<' + childrens.tagName + '\n              ' + _this._parsePropToString(childrens.prop) + '\n              id="' + childrens.id + '"\n              class="' + childrens.className + '">\n              ' + traversal(childrens.childrens).join('') + '\n            </' + childrens.tagName + '>';
          } else {
            return '<' + childrens.tagName + '\n              ' + _this._parsePropToString(childrens.prop) + '\n              id="' + childrens.id + '"\n              class="' + childrens.className + '">\n              ' + (_this._checkElement(childrens.childrens) ? _this._parseElementToString(childrens.childrens) : childrens.childrens) + '\n            </' + childrens.tagName + '>';
          }
        }
      };

      var html = '<' + tagName + '\n        ' + this._parsePropToString(prop) + '\n        id="' + id + '"\n        class="' + className + '">\n      ' + (childrens instanceof Array ? traversal(childrens).join('') : this._checkElement(childrens) ? this._parseElementToString(childrens) : childrens) + '\n      </' + tagName + '>';

      var newElement = document.createElement('div');
      newElement.insertAdjacentHTML('beforeEnd', html);

      return newElement.firstElementChild;
    }
  }, {
    key: 'findElements',
    value: function findElements(selector) {
      return $.makeArray(this.element.querySelectorAll(selector));
    }
  }, {
    key: '_nextMiddleware',
    value: function _nextMiddleware(data) {
      var middleware = this[secret.config].middlewares[this.middlewareIndex++];

      if (middleware) {
        middleware.call(this, this.element, this._nextMiddleware.bind(this), data);
      }
    }
  }, {
    key: '_runMiddlewares',
    value: function _runMiddlewares(data) {
      this._nextMiddleware(data);
    }
  }, {
    key: '_observeable',
    value: function _observeable() {
      var _this2 = this;

      var changes = this[secret.config].changes;


      changes.forEach(function (cp) {
        return Object.defineProperty(_this2, cp.model, {
          set: function set(obj) {
            _this2['m' + cp.model] = cp.handle.call(_this2, obj.element, obj.value);
          },
          get: function get() {
            return _this2['m' + cp.model];
          }
        });
      });
    }
  }, {
    key: '_getParent',
    value: function _getParent(parentSelector, element) {
      element = element.parentNode;

      while (element.nodeType !== 9 && !((element.matches || element.webkitMatchesSelector).call(element, parentSelector))) {
        element = element.parentNode;
      }

      return element.nodeType === 9 ? false : element;
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this3 = this;

      var handlers = this[secret.config].handlers;


      handlers.forEach(function (handler) {
        _this3.element.addEventListener(handler.eventName, function (e) {
          var target = e.target;
          var selectors = handler.selector.split(' ');
          var finalElement = null;
          var finalSelector = '';
          var isMatchSelector = selectors.some(function (selector) {
            if ((finalElement = (target.matches || target.webkitMatchesSelector).call(target, selector) && target) || (finalElement = _this3._getParent(selector, target))) {
              finalSelector = selector;
              return true;
            }
          });

          if (isMatchSelector) {
            handler.handles[finalSelector.slice(1)].call(_this3, finalElement, e);
          }
        });
      });
    }
  }, {
    key: 'use',
    value: function use(middleware) {
      var middlewares = this[secret.config].middlewares;


      if (middlewares.indexOf(middleware) < 0) {
        middlewares.push(middleware);
      }

      return this;
    }
  }, {
    key: 'finish',
    value: function finish(rootElement) {
      // 创建DOM
      this.element = this._buildElement(this[secret.config]);

      if (rootElement) {
        rootElement.appendChild(this.element);
      }

      // 数据绑定
      this._observeable();

      // 执行中间件
      this._runMiddlewares();

      // 事件绑定
      this._bindEvents();

      return this;
    }
  }]);

  return Nb;
}();

window.NB = function (config) {
  return new Nb(config);
};
