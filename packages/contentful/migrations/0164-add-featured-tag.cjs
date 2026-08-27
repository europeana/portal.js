
module.exports = function(migration) {
  const visibility = 'public';

  migration.createTag('featured', { name: 'Featured' }, visibility);
};
