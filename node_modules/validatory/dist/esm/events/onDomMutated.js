/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DomMutatedPublisher from './DomMutated/DomMutatedPublisher';
import DomMutatedSubscriber from './DomMutated/DomMutatedSubscriber';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
export default ({rootNode = document, selector, onDomMutatedCallback}) =>
  DomMutatedPublisher.subscribe(new DomMutatedSubscriber({rootNode, selector, onDomMutatedCallback}));
