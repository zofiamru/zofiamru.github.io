"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var root = function () {
    if ("scrollingElement" in document) return document.scrollingElement;
    var html = document.documentElement;
    var start = html.scrollTop;
    html.scrollTop = start + 1;
    var end = html.scrollTop;
    html.scrollTop = start;
    return end > start ? html : document.body;
  }();

  var ease = function ease(duration, elapsed, start, end) {
    return Math.round(end * (-Math.pow(2, -10 * elapsed / duration) + 1) + start);
  };

  var getCoordinates = function getCoordinates(hash) {
    var start = root.scrollTop;
    var delta = function () {
      if (hash.length < 2) return -start;
      var target = document.querySelector(hash);
      if (!target) return;
      var top = target.getBoundingClientRect().top;
      var max = root.scrollHeight - window.innerHeight;
      return start + top < max ? top : max - start;
    }();
    if (delta) return new Map([["start", start], ["delta", delta]]);
  };

  var scroll = function scroll(link) {
    var hash = link.getAttribute("href");
    var coordinates = getCoordinates(hash);
    if (!coordinates) return;

    var tick = function tick(timestamp) {
      progress.set("elapsed", timestamp - start);
      root.scrollTop = ease.apply(undefined, _toConsumableArray(progress.values()).concat(_toConsumableArray(coordinates.values())));
      progress.get("elapsed") < progress.get("duration") ? requestAnimationFrame(tick) : complete(hash, coordinates);
    };

    var progress = new Map([["duration", 800]]);
    var start = performance.now();
    requestAnimationFrame(tick);
  };

  var complete = function complete(hash, coordinates) {
    history.pushState(null, null, hash);
    root.scrollTop = coordinates.get("start") + coordinates.get("delta");
  };

  var attachHandler = function attachHandler(links, index) {
    var link = links.item(index);
    link.addEventListener("click", function (event) {
      event.preventDefault();
      scroll(link);
    });
    if (index) return attachHandler(links, index - 1);
  };

  var links = document.querySelectorAll("a.scroll");
  var last = links.length - 1;
  if (last < 0) return;
  attachHandler(links, last);
});
