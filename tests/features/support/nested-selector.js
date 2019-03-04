// Nested selectors taken from:
// https://markus.oberlehner.net/blog/acceptance-testing-with-nightwatch-and-cucumber-smart-step-definitions/

const prefixRegEx = /` in.*? (`.*`)/;

function parseSelectorChain(selectorChain) {
  return selectorChain
    .split('` `')
    .map(x => x.replace(/`/g, ''));
}

function extractPrefixSelectors(selectorChain) {
  const prefixMatch = selectorChain.match(prefixRegEx);

  return prefixMatch ? parseSelectorChain(prefixMatch[1]) : [];
}

function nestedSelector(selectorChain) {
  const prefixSelectors = extractPrefixSelectors(selectorChain);
  const selectors = parseSelectorChain(selectorChain.replace(prefixRegEx, '`'));

  return prefixSelectors
    .concat(selectors)
    .map(x => `[data-qa="${x.replace(/`/g, '')}"]`)
    .join(' ');
}

module.exports = {
  parseSelectorChain,
  extractPrefixSelectors,
  nestedSelector
};
