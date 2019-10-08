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
export default promise => {
  let hasBeenCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then((value) => {
        return hasBeenCanceled ? reject({isCanceled: true}) : resolve(value);
      })
      .catch((error) => {
        return hasBeenCanceled ? reject({isCanceled: true}) : reject(error);
      });
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasBeenCanceled = true;
    },
  };
};
