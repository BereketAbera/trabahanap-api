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
const STATE = {
  DEFAULT: 0,
  VALIDATING: 1,
  NOT_FILLED: 2,
  NOT_VALID: 3,
  VALID: 4
};

const STATE_DATA_ATTRIBUTE_VALUE = {
  [STATE.DEFAULT]: 'default',
  [STATE.VALIDATING]: 'validating',
  [STATE.NOT_FILLED]: 'not-filled',
  [STATE.NOT_VALID]: 'not-valid',
  [STATE.VALID]: 'valid',
};

export {
  STATE,
  STATE_DATA_ATTRIBUTE_VALUE
};
