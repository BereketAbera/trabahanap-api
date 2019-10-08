# Validatory
> A minimal yet powerful form validation library written in modern JavaScript. Zero dependencies!

## Installation

The recommended and the most suitable way to install it is using *Yarn*:
```bash
$ yarn add validatory
```
or alternatively with *NPM*:
```bash
$ npm install --save validatory
```

## How does it work?
The library will validate your *form-elements* using by default a ***RegExp* pattern based validation**, setting the 
corresponding `data-validation-state` attribute both to the *form-element* and the associated *form* after each 
*form-element*'s **input** and **change** events.

The *form-elements* will be the ones that are queried with the initialization's `formElementSelector` parameter, and the 
`data-validation-state` will be added by default to the *form-element*'s root node.

The *form-element* will have the following states:

- **data-validation-state="not-validated"** - This is the initial validation state.
- **data-validation-state="not-filled"** - If the element is marked as *required* but hasn't any value yet.
- **data-validation-state="valid"** - The element's value is valid.
- **data-validation-state="not-valid"** - If the element value hasn't passed the validation process. (Generic state)
- **data-validation-state="not-valid-custom-state"** - If the element value hasn't passed the validation process and the `custom-state` has been defined.

The *form* will have the following states:

- **data-validation-state="not-validated"** - This is the initial validation state.
- **data-validation-state="not-valid"** - If any of it's *form-elements* state is not valid.
- **data-validation-state="valid"** - If all of it's *form-elements* state is valid.

For example, after the validation has been triggered, a non-valid form element will have the following state:
```html
<input type="text" value="aaa" data-validate data-validate-email required data-validation-state="not-valid"/>
```

## Features

* **Asynchronous validation**
* Validate **required**
* Validate values with **regular expressions**
* **Built-in validation patterns**: 9 digit phone number, Email, ...
* Write your own **custom validator**

## Usage
In order to work with the library your DOM must, at least, have the following *data attributes* properly set.

- **data-validate**
- **required**
- **data-validate-phone**
- **data-validate-email**
- **data-validate-any**
- **data-validate-pattern="your-pattern"**
- **data-validation-state-reference-selector="your-selector"**

### DOM attributes

#### form
If you want to validate a **\<form>**, you must include the `data-validate` attribute. It's validation state will 
depend on it's elements' validation states. 
```html
<form action="/" data-validate></form>
```

#### form-element
If you want to validate an **\<input>**, **\<textarea>**, **\<select>**, ... , you must as well include the 
`data-validate` attribute. It's validation will be triggered after each `input` and `change` events. 
```html
<input type="text" data-validate/>
```

#### form-element - required
By setting the `required` attribute, the form element's value will be required, and it's state won't be valid until 
it's filled..
```html
<input type="text" data-validate required/>
```

#### form-element - built-in validators
As the validation process is by default based on *RegExp* patterns, the library will provide you the most common 
value-type-associated patterns. For the time being, it will automatically add the corresponding `data-validate-pattern` 
attribute to the elements with the following `data-validate-`type attributes.

Built-in validators won't work if the form element has not included the `data-validate` attribute.

##### *data-validate-phone*
It will validate **9 digit phone numbers**. It will add the corresponding `data-validate-pattern` attribute to the 
elements with the `data-validate-phone` attribute on runtime.
```html
<input type="tel" data-validate data-validate-phone/>
```

Both *123-123-123* and *123123123* phones will be valid.

##### *data-validate-email*
It will validate the element's value as an **email**, adding the correponding `data-validate-pattern` attribute to the 
elements with the `data-validate-email` attribute.
```html
<input type="email" data-validate data-validate-email/>
``` 

##### *data-validate-any*
This built-in validator will validate **any value** as valid.
```html
<input type="name" data-validate data-validate-any required/>
```

#### form-element - custom pattern validation
Apart from the built-in validators, you may want to validate a form element using a custom *RegExp* pattern. By adding a 
`data-validate-pattern="(-your RegExp pattern-)"` attribute to an element with the `data-validate` attribute, the 
library will automatically use the provided pattern for validating the associated value. For example:

###### Any value but *aValue*
This pattern will test as valid any value but the provided one. 
```html
<select data-validate data-validate-pattern="^(?!.*$aValue).*$"></select>
```

###### 2-5 letter palindrome
This pattern will test as valid any value but the provided one. 
```html
<textarea data-validate data-validate-pattern="\b(\w)?(\w)\w?\2\1"></textarea>
```

And so on.

#### Custom *data-validation-state* dom node
If you want the associated `data-validation-state` attribute to be set o node different from the selector matching one, 
you will want to use the `data-validation-state-reference-selector` attribute. The library will look up for the first 
selector-matching parent. For example:
```html
<label class="form-checkbox" tabindex="0">
    <input type="checkbox" class="form-checkbox__check" id="terms" name="terms" 
        required data-validate data-validate-any data-validation-state-reference-selector=".form-checkbox">
    <span class="form-checkbox__content">I have read an accept the terms and conditions</span>
</label>
```

### Initialization - basic
In order to properly initialize the library, we will call the library's `init` method, passing at least the following 
parameters.

```js
import {init} from 'validatory';

init({
  formSelector: 'form',
  formElementSelector: 'input, select, textarea'
});
```

Both *formSelector* and *formElementSelector* can be any valid CSS selectors.

### Initialization - with callbacks

Initialization with callbacks.

```js
import {init} from 'validatory';

const
  formValidationStateChangedCallback = formValidatorInstance => {
    const formState = formValidatorInstance.state;
    // ...
  },
  formElementValidationStateChangedCallback = formElementValidatorInstance => {
    const formElementState = formElementValidatorInstance.state;
    // ...
  };

init({
  formSelector: 'form',
  formElementSelector: 'input, select, textarea',
  onFormValidationStateChanged: formValidationStateChangedCallback,
  onFormElementValidationStateChanged: formElementValidationStateChangedCallback
});
```

### Styling
As the library will set a **data-validation-state** attribute, we will style the element using this *data attribute*. 
For example:
```scss
.form-input {
  &[data-validation-state="not-filled"],
  &[data-validation-state="not-valid"] {
    border-color: $form-input-border-color-error;
  }

  &[data-validation-state="valid"] {
    border-color: $form-input-border-color-valid;
  }
}
```

### Displaying error messages
We will use the **data-validation-state** attribute to show/hide the associated error messages. For example:
```html
<div class="form-group-input">
    <div class="form-group-input__label">
        <label class="form-label" for="required-phone"><span class="form-label__required">*</span>Phone</label>
    </div>
    <input id="required-phone" name="required-phone" type="tel" class="form-input" placeholder="Enter a 9 digit phone..." 
        required data-validate data-validate-phone autocomplete="off" tabindex="0">
    <div class="form-group-input__errors">
        <p class="form-error form-error--not-filled">This field is required.</p>
        <p class="form-error form-error--not-valid">Entered phone does not match the required pattern.</p>
    </div>
</div>
```

```scss
.form-group-input__errors {
  display: none;
  position: relative;
  z-index: -1;
}

[data-validation-state="not-valid"] + .form-group-input__errors,
[data-validation-state="not-filled"] + .form-group-input__errors {
    display: block;
}

[data-validation-state="not-valid"] + .form-group-input__errors {
  .form-error--not-valid {
    animation: $form-group-errors-animation;
    display: block;
  }
}

[data-validation-state="not-filled"] + .form-group-input__errors {
  .form-error--not-filled {
    animation: $form-group-errors-animation;
    display: block;
  }
}
```

### Extending the library's Validators
In order to extend the library's validators, we will add a new **Validator** instance to the *ValidatorRegistry*, 
passing the required constructor parameters.

Your custom validation implementation must return/resolve with an object shaped as follows:

```js
{
  valid: boolean,
  errorCode: string (optional)
}
```
 
For example:

#### Synchronous validator
```js
import {validatorRegistry, Validator} from 'validatory';

const customValidator = new Validator({
  supports: node => node.classList.contains('form-textarea'),
  isEmpty: node => node.value === '',
  isValid: node => ({
    valid: node.value === 'test'
  }),
});

validatorRegistry.add(customValidator);
```

#### Asynchronous validator
```js
import {validatorRegistry, Validator} from 'validatory';

const yourAsyncValidationPromise = new Promise(resolve => setTimeout(() => resolve(true), 3000));

const customValidator = new Validator({
  supports: node => node.classList.contains('form-textarea'),
  isEmpty: node => node.value === '',
  isValid: node => new Promise(resolve => yourAsyncValidationPromise.then(result => {
    const valid = result === 'valid'; // Your custom validation
    
    return resolve(valid ? {valid} : {valid, errorCode: 'your-custom-error-code'});
  })),
});

validatorRegistry.add(customValidator);
```

### Extending the library's Validators - Async validation helper

The library provides a helper method `asyncValidation` that will wrap your async logic and reduce the boilerplate needed to write a custom async validator.

```js
import {asyncValidation} from 'validatory';

const isValid = node => asyncValidation(fetch('https://jsonplaceholder.typicode.com/posts/1'), response => 
  node.value === 'bla bla' ? {valid: true} : {valid: false, errorCode: 'no-service'});

const customAsyncValidator = new Validator({
  supports: node => node.id === 'asyn-custom-validation-field',
  isEmpty: node => node.value === '',
  isValid: node => isValid(node)
});
````

### Extending the library's Validators - Full example with Styles & custom `data-states`
If your are writting a custom validator that needs to display a custom error message based on the validation logic, 
you will need to implement the validator and add these styles to your app. 

In this example, we are using the `es6-promise-debounce` for debouncing the validation process.

```js
import debounce from 'es6-promise-debounce';
import {validatorRegistry, Validator, asyncValidation} from 'validatory';

const
  debouncedValidation = debounce(node => {
    console.log('Asynchronous validation started');

    const validZipCode = /^\d{5}$/.test(node.value); // zip code format validation

    if (!validZipCode) {
      return {valid: false, errorCode: 'zip-code'};
    }

    return asyncValidation(fetch('https://jsonplaceholder.typicode.com/posts/1'), response => {
      const valid = node.value === '01005';

      return valid ? {valid} : {valid: false, errorCode: 'no-service'};
    });
  }, 500),
  asyncValidator = new Validator({
    supports: node => node.id === 'async',
    isEmpty: node => node.value === '',
    isValid: node => debouncedValidation(node),
  });

validatorRegistry.add(asyncValidator);
``` 

```scss
@import './../_definitions/animations';
$form-group-errors-animation: $animation-vertical-node-in;

[data-validation-state="not-valid-zip-code"] ~ .form-group-input__errors .form-error--not-valid-zip-code,
[data-validation-state="not-valid-no-service"] ~ .form-group-input__errors .form-error--not-valid-no-service {
  animation: $form-group-errors-animation;
  display: block;
}
```

For a full working example, checkout the [tests/app][1] demo.

[1]: https://github.com/FriendsOfECMAScript/Validatory/tree/master/tests/app
