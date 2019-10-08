/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import isDomNodeDescendantOfDomNode from './../dom/isDomNodeDescendantOfDomNode';
import setDomNodeDataAttributeByValidatorState from './../dom/setDomNodeDataAttributeByValidatorState';
import onDomReady from './../events/onDomReady';
import onDomMutated from './../events/onDomMutated';
import * as Patterns from './../patterns/patterns';
import {STATE} from './FormValidatorState';
import validatorRegistry from './ValidatorRegistry';
import FormElementValidator from './FormElementValidator';
import dispatchNativeEvent from './../dom/dispatchNativeEvent';

/**
 * @author Mikel Tuesta <mikeltuesta@gmail.com>
 */
class FormValidator {
  constructor({
    formDomNode,
    formElementSelector,
    onFormValidationStateChanged = () => {},
    onFormElementValidationStateChanged = () => {}
  } = {}) {
    this.formDomNode = formDomNode;
    this.formElementSelector = formElementSelector;
    this.onFormValidationStateChanged = onFormValidationStateChanged;
    this.onFormElementValidationStateChanged = onFormElementValidationStateChanged;
    this.formElements = [];
    this.state = STATE.DEFAULT;
    this.needsValidation = true;
    setDomNodeDataAttributeByValidatorState(this.formDomNode, this.state);

    this.onDomReady = this.onDomReady.bind(this);
    this.onDomMutated = this.onDomMutated.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.initFormElement = this.initFormElement.bind(this);
    this.validateOnFormElementStateChanged = this.validateOnFormElementStateChanged.bind(this);

    this.bindListeners();
  }

  bindListeners() {
    onDomReady(this.onDomReady);
    onDomMutated({
      rootNode: this.formDomNode,
      selector: this.formElementSelector,
      onDomMutatedCallback: this.onDomMutated
    });
    this.formDomNode.addEventListener('submit', this.onFormSubmit);
  }

  onDomReady() {
    [...Array.from(this.formDomNode.querySelectorAll(this.formElementSelector))].forEach(this.initFormElement);
  }

  onDomMutated({addedNodes, removedNodes}) {
    this.formElements = this.formElements.filter(formElement =>
      removedNodes.find(removedNode => removedNode === formElement.formElementDomNode) === undefined);

    addedNodes.forEach(formElementNode => this.initFormElement(formElementNode));

    // this.setState(this.isValid() ? STATE.VALID : STATE.NOT_VALID);

    this.isValid().then(isValid => this.setState(isValid ? STATE.VALID : STATE.NOT_VALID));
  }

  initFormElement(formElementDomNode) {
    this.preProcessFormElementValidationPattern(formElementDomNode);

    const validator = this.getFormElementValidatorInstance(formElementDomNode);

    if (validator === null) {
      return;
    }

    this.formElements.push(validator);

    this.setState(STATE.DEFAULT);
  }

  onFormSubmit(event) {
    if (this.needsValidation) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.validate().then(isValid => {
        if (isValid) {
          this.needsValidation = false;
          dispatchNativeEvent(this.formDomNode, 'submit');
        }
      });
    }
  }

  setState(newState) {
    if (this.state === newState) {
      return;
    }

    this.state = newState;

    setDomNodeDataAttributeByValidatorState(this.formDomNode, this.state);

    this.onFormValidationStateChanged(this);
  }

  setDataValidationPatternAttribute(formElementDomNode, pattern) {
    formElementDomNode.setAttribute('data-validate-pattern', pattern);
  }

  preProcessFormElementValidationPattern(formElementDomNode) {
    const
      builtInValidationPatternsKeys = ['email', 'phone', 'any'],
      needsPreProcessing = builtInValidationPatternsKeys.some(key =>
        formElementDomNode.hasAttribute(`data-validate-${key}`));

    if (needsPreProcessing) {
      if (formElementDomNode.hasAttribute('data-validate-email')) {
        this.setDataValidationPatternAttribute(formElementDomNode, Patterns.email);
      } else if (formElementDomNode.hasAttribute('data-validate-phone')) {
        this.setDataValidationPatternAttribute(formElementDomNode, Patterns.phone);
      } else {
        this.setDataValidationPatternAttribute(formElementDomNode, Patterns.any);
      }
    }
  }

  focusOnFirstInvalidElement() {
    let
      valid = true,
      formElementIndex = 0;

    while(valid && formElementIndex < this.formElements.length) {
      if (this.formElements[formElementIndex].state === STATE.NOT_VALID) {
        valid = false;
      } else {
        formElementIndex ++;
      }
    }

    if (!valid) {
      this.formElements[formElementIndex].focus();
    }
  }

  isValid() {
    const validPromises = Promise.all(this.formElements.map(formElement => formElement.isValid()));

    return new Promise(resolve => validPromises.then(validResults =>
      resolve(validResults.every(validResult => validResult.valid))));
  }

  validate() {
    this.setState(STATE.VALIDATING);
    const validationPromises = Promise.all(this.formElements.map(formElement => formElement.validate()));

    return new Promise(resolve => {
      validationPromises.then(validationResults => {
        const isValid = validationResults.every(validationResult => validationResult.valid);
        this.setState(isValid ? STATE.VALID : STATE.NOT_VALID);
        this.focusOnFirstInvalidElement();

        resolve(isValid);
      });
    });
  }

  validateOnFormElementStateChanged(formElementValidatorInstance) {
    this.needsValidation = true;

    this.isValid().then(isValid => {
      this.setState(isValid ? STATE.VALID : STATE.NOT_VALID);

      this.onFormElementValidationStateChanged(formElementValidatorInstance);
    });
  }

  getFormElementValidatorInstance(formElementDomNode) {
    const validator = validatorRegistry.getValidators().find(validator => validator.supports(formElementDomNode));

    if (validator === undefined) {
      return null;
    }

    return new FormElementValidator({
      formElementDomNode,
      emptyFn: validator.isEmpty,
      getValueFn: validator.getValue,
      validationFn: validator.isValid,
      onFormElementStateChangedCallback: this.validateOnFormElementStateChanged
    });
  }
}

export default FormValidator;
