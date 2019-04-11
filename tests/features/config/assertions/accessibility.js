/*jshint esversion: 6 */

const util = require('util');

const script = function (context, options, done) {
  if (!window.axe) done({ error: 'aXe not found. Make sure it has been injected' })

  window
    .axe
    .run(context, options)
    .then(function (results) {
      done({ results: results });
    })
    .catch(function (error) {
      done({ error: error.toString() });
    })
}

exports.assertion = function(context, config) {

  //const FAILURE_MSG = ' Issue: %s\n Target: (%s)\n Impact: %s,\n Type: %s,\n Help: %s \n';
  const FAILURE_MSG = 'Accessibility violations found: %s \n\n%s'
  const PASS_MSG = '%d aXe a11y tests passed';

  /**
   * The message which will be used in the test output and
   * inside the XML reports
   * @type {string}
   */
  this.message = null;

  /**
   * Cached results
   * inside the XML reports
   * @type {object|string}
   */
  this.results = null;

  /**
   * A value to perform the assertion on. If a function is
   * defined, its result will be used.
   * @type {function|*}
   */
  this.expected = null;

  /**
   * The method which performs the actual assertion. It is
   * called with the result of the value method as the argument.
   *
   * Some hackiness in here to get legible logging
   * @type {function}
   */
  this.pass = function(value) {
    var passed = !this.results.violations.length;

    if (passed) {
      this.message = util.format(PASS_MSG, this.results.passes.length);
    } 

    return passed;
  };

  this.failure = function (result) {

    const violations = result.value.results.violations;
    let failMessage = '';

    for (const violation of violations) {
      failMessage += '# ' + violation.impact + ': ' + violation.help + ' (' + violation.helpUrl + ')\n';
    } 

    this.expected = 0;
    this.message = util.format(FAILURE_MSG, result.value.results.violations.length, failMessage);
    
    return false;
  };

  /**
   * The method which returns the value to be used on the
   * assertion. It is called with the result of the command's
   * callback as argument.
   *
   * Some hackiness in here to get legible logging
   * @type {function}
   */
  this.value = function(result) {

    var value = this.results = result.value.results;
    
    if (value.violations.length) {// we got errors
      return value.violations.length;
    }
    return result.value;
  };

  /**
   * Performs a protocol command/action and its result is
   * passed to the value method via the callback argument.
   * @type {function}
   */
  this.command = function(callback) {
    this.api.executeAsync(script, [context, config], function (result) {
      callback(result);
    });
    return this;
  };

};