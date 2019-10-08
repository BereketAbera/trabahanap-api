/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
(() => {
  if (typeof window.CustomEvent === 'function') return false;

  const CustomEvent = (event, params) => {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };

    const customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

    return customEvent;
  };

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

export default (domNode, eventName) => {
  const evt = new CustomEvent(eventName, {bubbles: true, cancelable: true});
  domNode.dispatchEvent(evt);
};
