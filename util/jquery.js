import $ from 'jquery';

$.fn.nextUntilWithTextNodes = function (until) {
  var matched = $.map(this, function (elem, i, until) {
      var matched = [];
      while ((elem = elem.nextSibling) && elem.nodeType !== 9) {
          if (elem.nodeType === 1 || elem.nodeType === 3) {
              if (until && jQuery(elem).is(until)) {
                  break;
              }
              matched.push(elem);
          }
      }
      return matched;
  }, until);

  return this.pushStack(matched);
};