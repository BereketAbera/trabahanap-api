/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {STATE} from './FormValidatorState';
import setDomNodeDataAttributeByValidatorState from './../dom/setDomNodeDataAttributeByValidatorState';
import dispatchNativeEvent from './../dom/dispatchNativeEvent';
import cancelablePromise from './../async/cancelablePromise';
import {isIE11} from './../utils/DetectBrowser';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
class FormElementValidator {

  constructor({
    formElementDomNode,
    getValueFn,
    emptyFn,
    validationFn,
    onFormElementStateChangedCallback = () => {
    }
  }) {
    this.formElementDomNode = formElementDomNode;
    this.getValueFn = getValueFn;
    this.emptyFn = emptyFn;
    this.validationFn = validationFn;
    this.validationPromise = null;
    this.required = this.formElementDomNode.hasAttribute('required');
    this.validationStateReferenceSelector = this.formElementDomNode.dataset.validationStateReferenceSelector;
    this.state = STATE.DEFAULT;
    this.prevValue = null;
    setDomNodeDataAttributeByValidatorState(this.getValidationStateReferenceDomNode(), this.state);

    this.onFormElementStateChangedCallback = onFormElementStateChangedCallback;
    this.validateIfChanged = this.validateIfChanged.bind(this);

    this.bindListeners();
  }

  bindListeners() {
    // IE11 triggers the event before any input is entered
    if (!isIE11()) {
      this.formElementDomNode.addEventListener('input', this.validateIfChanged, true);
    }

    this.formElementDomNode.addEventListener('change', this.validateIfChanged, true);
  }

  validateIfChanged() {
    const currentValue = this.getValueFn(this.formElementDomNode);

    if (this.prevValue === currentValue) {
      return;
    }

    this.prevValue = currentValue;

    this.validate();
  }

  getValidationStateReferenceDomNode() {
    return this.validationStateReferenceSelector !== undefined
      ? this.formElementDomNode.closest(this.validationStateReferenceSelector)
      : this.formElementDomNode;
  }

  setState(newState) {
    if (this.state === newState) {
      return;
    }

    this.state = newState;

    setDomNodeDataAttributeByValidatorState(this.getValidationStateReferenceDomNode(), this.state);

    this.onFormElementStateChangedCallback(this);
  }

  focus() {
    dispatchNativeEvent(this.getValidationStateReferenceDomNode(), 'focus');
  }

  isValid() {
    return Promise.resolve(
      this.emptyFn(this.formElementDomNode) ? {valid: !this.required} : this.validationFn(this.formElementDomNode)
    );
  }

  validate() {
    this.setState(STATE.VALIDATING);
    const isEmpty = this.emptyFn(this.formElementDomNode);

    if (this.validationPromise !== null) {
      this.validationPromise.cancel();
      this.validationPromise = null;
    }

    this.validationPromise = cancelablePromise(this.isValid());

    this.validationPromise.promise.then(validationResult => {
      const state = this.required && isEmpty ? STATE.NOT_FILLED : validationResult.valid
        ? STATE.VALID
        : validationResult.errorCode ? validationResult.errorCode : STATE.NOT_VALID;

      this.setState(state);
    }).catch(e => {});

    return this.validationPromise.promise;
  }
}

export default FormElementValidator;
