const migration95 = require('./0095-add-theme-field-to-blogPosting.cjs');

const contentTypeName = 'exhibitionPage';

module.exports = function(migration, ctx) {
  migration95(migration, ctx, contentTypeName);
}
