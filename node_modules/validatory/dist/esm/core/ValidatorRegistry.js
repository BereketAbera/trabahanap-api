/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Validator from './Validator';
import checkboxValidator from './../validators/checkboxValidator';
import patternValidator from './../validators/patternValidator';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */

const validators = [];

const addValidator = validator => {
  if (!validator instanceof Validator) {
    throw new TypeError('Provided validator is not an instance of Validator');
  }

  validators.unshift(validator);
};

const validatorsRegistry = {
  getValidators: () => [...validators],
  add: addValidator
};

validatorsRegistry.add(patternValidator);
validatorsRegistry.add(checkboxValidator);

export default validatorsRegistry;
