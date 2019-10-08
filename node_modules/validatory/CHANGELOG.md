# CHANGELOG

This changelog references the relevant changes done between versions.

To get the diff for a specific change, go to https://github.com/FriendsOfECMAScript/Validatory/commit/XXX where XXX is 
the change hash. To get the diff between two versions, go to https://github.com/FriendsOfECMAScript/Validatory/compare/v0.1.0...v0.1.1

* 0.3.0
    * Refactored the mutation api relative subscriber/subscription. It does now work for added/removed nodes.
* 0.2.5
    * Fixed `dispatchNativeEvent` bug on modern browsers. Refactored event dispatching implementation.
* 0.2.4
    * Fixed form submission and event blocking bug.
* 0.2.3
    * Fixed no-required validation bug
* 0.2.2
* 0.2.1
* 0.2.0
    * Refactored the validation process implementation to allow `asynchronous validation` logics.
    * Refactored the validation `data-states` setting implementation. It is now allowed to define your own validation `data-state`. 
* 0.1.1
    * Updated phone RegExp pattern.
    * Fixed spread over NodeList.
    * Updated library bundle export configuration.
* 0.1.0
    * Initial release
