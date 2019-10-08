/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {STATE_DATA_ATTRIBUTE_VALUE} from './../core/FormValidatorState';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
export default (domNode, validatorState) => {
  domNode.dataset.validationState = STATE_DATA_ATTRIBUTE_VALUE[validatorState] || `not-valid-${validatorState}`;
};
