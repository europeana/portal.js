const sites = ['dataspace-culturalheritage.eu'];

module.exports = function(migration) {
  const categoryFeaturedContent = migration
    .createContentType('categoryFeaturedContent')
    .name('Category featured content')
    .description(
      'Content to feature on a specific tag.'
    )
    .displayField('name');

  categoryFeaturedContent
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  categoryFeaturedContent
    .createField('category')
    .name('Category')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([
      {
        linkContentType: ['category']
      }
    ])
    .disabled(false)
    .omitted(false);

  categoryFeaturedContent
    .createField('site')
    .name('Site')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: sites
      }
    ])
    .defaultValue({
      'en-GB': sites[0]
    })
    .disabled(false)
    .omitted(false);

  categoryFeaturedContent
    .createField('featuredContent')
    .name('Featured content')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['blogPosting', 'event', 'projectPage']
      }
    ]);

  categoryFeaturedContent.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'For Editorial use only.'
  });
};
