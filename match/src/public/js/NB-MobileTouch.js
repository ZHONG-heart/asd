'use strict';

;(function () {
  var defOptions = {
    tap: function tap() {
      return false;
    },
    swipeTop: function swipeTop() {
      return false;
    },
    swipeLeft: function swipeLeft() {
      return false;
    },
    swipeBottom: function swipeBottom() {
      return false;
    },
    swipeRight: function swipeRight() {
      return false;
    }
  };

  function transferTouch(process) {
    return function (e) {
      e.stopPropagation();
      var touch = void 0;

      if (!(touch = e.targetTouches[0]) || e.scale && e.scale == 1) {
        return;
      }

      return process.call(this, e.targetTouches[0], e);
    };
  }

  var NBMobileTouch = NBClass({
    initialize: function initialize(el, options) {
      var _NBUtil$copy = NBUtil.copy({}, defOptions, options),
          tap = _NBUtil$copy.tap,
          swipeTop = _NBUtil$copy.swipeTop,
          swipeLeft = _NBUtil$copy.swipeLeft,
          swipeBottom = _NBUtil$copy.swipeBottom,
          swipeRight = _NBUtil$copy.swipeRight;

      this.el = el;
      this.distanceX = this.distanceY = this.startTime = null;
      this.readyX = this.readyY = 0;
      this.tap = tap;
      this.swipeTop = swipeTop;
      this.swipeLeft = swipeLeft;
      this.swipeBottom = swipeBottom;
      this.swipeRight = swipeRight;

      this.touchstart = this.touchstart.bind(this);
      this.touchend = this.touchend.bind(this);
      this.touchmove = this.touchmove.bind(this);

      this.bindElEvent();
    },
    isTap: function isTap() {
      return +new Date() - this.startTime < 300 || Math.abs(this.distanceX) < 50 && Math.abs(this.distanceY) < 50;
    },
    isSwipeTop: function isSwipeTop() {
      return Math.abs(this.distanceX) <= Math.abs(this.distanceY) && this.distanceY < 0;
    },
    isSwipeLeft: function isSwipeLeft() {
      return Math.abs(this.distanceY) <= Math.abs(this.distanceX) && this.distanceX < 0;
    },
    isSwipeBottom: function isSwipeBottom() {
      return Math.abs(this.distanceY) > Math.abs(this.distanceX) && this.distanceY > 0;
    },
    isSwipeRight: function isSwipeRight() {
      return Math.abs(this.distanceX) > Math.abs(this.distanceY) && this.distanceX > 0;
    },


    touchstart: transferTouch(function (touch, e) {
      this.startTime = +new Date();
      this.readyX = touch.pageX;
      this.readyY = touch.pageY;
    }),

    touchmove: transferTouch(function (touch, e) {
      this.distanceX = touch.pageX - this.readyX;
      this.distanceY = touch.pageY - this.readyY;
    }),

    touchend: function touchend(e) {
      e.stopPropagation();

      if (this.isTap()) {
        this.tap.call(this, e);
      } else if (this.isSwipeTop()) {
        this.swipeTop.call(this, e);
      } else if (this.isSwipeLeft()) {
        this.swipeLeft.call(this, e);
      } else if (this.isSwipeBottom()) {
        this.swipeBottom.call(this, e);
      } else if (this.isSwipeRight()) {
        this.swipeRight.call(this, e);
      }
    },
    bindElEvent: function bindElEvent() {
      this.el.addEventListener('touchstart', this.touchstart, false);
      this.el.addEventListener('touchmove', this.touchmove, false);
      this.el.addEventListener('touchend', this.touchend, false);
    },
    unBindElEvent: function unBindElEvent() {
      this.el.removeEventListener('touchstart', this.touchstart, false);
      this.el.removeEventListener('touchmove', this.touchmove, false);
      this.el.removeEventListener('touchend', this.touchend, false);
    }
  });

  window.NBMobileTouch = function (el, options) {
    return new NBMobileTouch(el, options);
  };
})();
