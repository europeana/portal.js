const purgeContentType = require('../src/utils.cjs').purgeContentType;

module.exports = async function (migration, context) {
  await purgeContentType('imageGallery', migration, context);
};
