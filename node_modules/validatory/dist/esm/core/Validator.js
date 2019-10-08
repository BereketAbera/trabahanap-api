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
class Validator {
  constructor({supports, isEmpty, isValid, getValue}) {
    this.checkParameters(supports, isEmpty, isValid);

    this.supports = supports;
    this.getValue = getValue || (node => node.value);
    this.isEmpty = isEmpty; // synchronous callback
    this.isValid = isValid; // sync/async (callback|promise)
  }

  checkParameters(supports, isEmpty, isValid) {
    if (typeof supports !== 'function' || typeof isEmpty !== 'function' || typeof isValid !== 'function') {
      throw new TypeError(`In order to instantiate a Validator object, you must provide the 
        {supports, isEmpty, isValid} required parameters`);
    }
  }
}

export default Validator;
