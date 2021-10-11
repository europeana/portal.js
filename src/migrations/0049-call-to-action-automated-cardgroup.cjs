module.exports = function(migration) {
  const automatedCardGroup = migration.editContentType('automatedCardGroup');

  automatedCardGroup.createField('moreButton')
    .name('More Button')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      {
        linkContentType: ['link']
      }
    ])
    .disabled(false)
    .omitted(false); 
};
