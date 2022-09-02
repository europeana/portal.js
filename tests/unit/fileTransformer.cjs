// as recommended and copied from https://jestjs.io/docs/code-transformation#transforming-images-to-their-path
const path = require('path');

module.exports = {
  process(sourceText, sourcePath) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`
    };
  }
};
