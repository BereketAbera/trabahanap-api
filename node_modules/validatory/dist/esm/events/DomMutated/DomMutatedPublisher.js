/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DomMutatedSubscriber from './DomMutatedSubscriber';
import DomMutatedEvent from './DomMutatedEvent';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */

class DomMutatedPublisher {
  constructor() {
    this.mutationObserver = null;
    this.isMutationObserverInitialized = false;
    this.subscribers = [];
  }

  initMutationObserver() {
    const
      targetNode = document.body,
      observerConfig = {
        childList: true,
        subtree: true
      };

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    this.mutationObserver = new MutationObserver(this.onMutations.bind(this));
    this.mutationObserver.observe(targetNode, observerConfig);

    this.isMutationObserverInitialized = true;
  }

  subscribe(domMutatedSubscriber) {
    if (!(domMutatedSubscriber instanceof DomMutatedSubscriber)) {
      throw new TypeError('You can only subscribe DomMutatedSubscriber instances');
    }

    this.subscribers.push(domMutatedSubscriber);

    if (this.isMutationObserverInitialized) {
      return;
    }

    this.initMutationObserver();
  }

  onMutations(mutations) {
    mutations.forEach(mutation => {
      const
        target = mutation.target,
        addedNodes = Array.from(mutation.addedNodes),
        removedNodes = Array.from(mutation.removedNodes);

      if (addedNodes.length === 0 && removedNodes.length === 0) {
        return;
      }

      this.subscribers.forEach(subscriber =>
        subscriber.handle(new DomMutatedEvent({target, addedNodes, removedNodes})));
    });
  }
}

const instance = new DomMutatedPublisher();

export default instance;
