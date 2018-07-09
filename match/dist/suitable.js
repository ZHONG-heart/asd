'use strict';

function suitable() {
  var expect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 720;

  var dpr = window.devicePixelRatio;
  var sence = window.screen.width;
  var headElement = document.getElementsByTagName('head')[0];
  var meta = document.createElement('meta');

  meta.setAttribute('name', 'viewport');
  meta.setAttribute('content', 'width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no');
  headElement.insertBefore(meta, headElement.firstElementChild);

  document.documentElement.setAttribute('data-dpr', dpr);
  document.documentElement.style.fontSize = sence / expect * 100 + 'px';
}

window.suitable = suitable;