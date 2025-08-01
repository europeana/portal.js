const deleteContentEntries = require('../src/utils/deleteContentEntries.cjs');

module.exports = async function (migration, context) {
  await deleteContentEntries('imageGallery', migration, context);
};
