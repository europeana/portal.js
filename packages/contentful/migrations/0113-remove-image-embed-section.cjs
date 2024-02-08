module.exports = async function(migration) {
  const embedSection = migration
    .editContentType('embedSection');

  embedSection
    .deleteField('image');
};
