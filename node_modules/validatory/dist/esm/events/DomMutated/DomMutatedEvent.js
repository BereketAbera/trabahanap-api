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
class DomMutatedEvent {
  constructor({target, addedNodes, removedNodes}) {
    this.target = target;
    this.addedNodes = addedNodes;
    this.removedNodes = removedNodes;
  }
}

export default DomMutatedEvent;
