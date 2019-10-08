/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Validator from '../core/Validator';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */

const patternValidator = new Validator({
  supports: node => node.hasAttribute('data-validate-pattern'),
  isEmpty: node => node.value === '',
  isValid: node => {
    const validationRegExp = new RegExp(node.dataset.validatePattern.trim());
    return {valid: validationRegExp.test(node.value)};
  },
});

export default patternValidator;
