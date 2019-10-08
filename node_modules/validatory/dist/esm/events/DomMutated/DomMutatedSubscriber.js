/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DomMutatedEvent from './DomMutatedEvent';
import isDomNodeDescendantOfDomNode from './../../dom/isDomNodeDescendantOfDomNode';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
const filterNodes = ({nodes, target, rootNode, selector}) => {
  if (target !== rootNode && !isDomNodeDescendantOfDomNode(target, rootNode)) {
    return [];
  }

  let nodesToFilter = [];

  nodes.forEach(node => {
    if (typeof node.querySelectorAll === 'function' && Array.from(node.childNodes).length > 0) {
      nodesToFilter = [...nodesToFilter, ...Array.from(node.querySelectorAll(selector))];
    } else {
      nodesToFilter = [...nodesToFilter, node];
    }
  });

  const parent = document.createElement('div');

  nodesToFilter.forEach(node => {
    const clonedNode = node.cloneNode(true);
    parent.appendChild(clonedNode);
  });

  const filteredNodes = Array.from(parent.querySelectorAll(selector));

  return nodesToFilter.filter(node => filteredNodes.find(filteredNode => filteredNode.innerHTML === node.innerHTML));
};

class DomMutatedSubscriber {
  constructor({rootNode, selector, onDomMutatedCallback}) {
    this.rootNode = rootNode;
    this.selector = selector;
    this.onDomMutatedCallback = onDomMutatedCallback;
  }

  handle(domMutatedEvent) {
    if (!(domMutatedEvent instanceof DomMutatedEvent)) {
      throw TypeError('DomMutatedSubscriber cannot handle any event but DomMutatedEvent ones');
    }

    const
      matchedAddedNodes = filterNodes({
        nodes: domMutatedEvent.addedNodes,
        target: domMutatedEvent.target,
        rootNode: this.rootNode,
        selector: this.selector,
      }),
      matchedRemovedNodes = filterNodes({
        nodes: domMutatedEvent.removedNodes,
        target: domMutatedEvent.target,
        rootNode: this.rootNode,
        selector: this.selector,
      });

    if (matchedAddedNodes.length === 0 && matchedRemovedNodes.length === 0) {
      return;
    }

    this.onDomMutatedCallback({addedNodes: matchedAddedNodes, removedNodes: matchedRemovedNodes});
  }
}

export default DomMutatedSubscriber;
