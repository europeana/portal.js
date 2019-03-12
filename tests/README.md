## Tests

The test directory contains unit and e2e tests.


## Guidelines on testing end to end (e2e)

End to end tests are written as Gherkin scripts for cucumber.js inside the tests/features directory.
End to end scripts should be written in as human readable a way as possible.
The step definitions which are available are based on [this](https://markus.oberlehner.net/blog/acceptance-testing-with-nightwatch-and-cucumber-setup/) and [this guide](https://markus.oberlehner.net/blog/acceptance-testing-with-nightwatch-and-cucumber-smart-step-definitions/).

### Usage of _data-qa_

In order to isolate testing from the implementation we make use of data-qa attributes.
The data-qa attributes should be used primarily in e2e tests and can be added on any element. You may still use them in unit tests, but try to avoid defining them _for_ unit tests. In unit tests prefer other data-x attributes or identefiers and html tags for finding specific elements.
Matching of data-qa elements will look for an exact match when using the standard definitions.

When adding or refactoring data-qa attributes, keep in mind that they:

* Should be human readable, and not require in depth domain or application knowledge.
```
# Good
<img data-qa="thumbnail"...
```

```
# Bad
<img data-qa="edmPreview browse-page"...
```
* Should be concise and avoid overly specific qa attributes.
  Nesting can be specified using the nested selector chaining functionality.
```
# Good
<input data-qa="search button"...
```

```
# Bad
<input data-qa="search form search button at top of page"...
```
* Should be relevant and descriptive.
* Should be specific for the element to which they will be applied.
* However _may be_ repeated multiple times where the same element is rendered multiple times.
