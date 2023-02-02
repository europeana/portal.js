const themes = [
  { themeId: 'archaeology', entityId: 80 },
  { themeId: 'art', entityId: 190 },
  { themeId: 'fashion', entityId: 55 },
  { themeId: 'industrial-heritage', entityId: 129 },
  { themeId: 'manuscripts', entityId: 17 },
  { themeId: 'maps-and-geography', entityId: 151 },
  { themeId: 'migration', entityId: 128 },
  { themeId: 'music', entityId: 62 },
  { themeId: 'natural-history', entityId: 156 },
  { themeId: 'newspapers', entityId: 18 },
  { themeId: 'photography', entityId: 48 },
  { themeId: 'sport', entityId: 114 },
  { themeId: 'world-war-i', entityId: 83 }
];

module.exports = async function(migration, ctx, contentTypeName = 'blogPosting') {
  if (!process.env.THEME_PAGE_SUGGEST_APP_ID) {
    console.log('No app ID specified in THEME_PAGE_SUGGEST_APP_ID; aborting.');
    process.exit(1);
  }

  // Get the theme pages
  const response = await ctx.makeRequest({
    method: 'GET',
    url: '/entries',
    params: {
      'content_type': 'themePage',
      limit: 1000
    }
  });

  for (const entry of response.items) {
    const identifier = entry.fields.identifier['en-GB'];
    const theme = themes.find((theme) => theme.themeId === identifier);
    if (!theme) {
      console.error(`No theme found for ${identifier}; aborting.`);
      process.exit(1);
    }
    theme.sysId = entry.sys.id;
  }

  const contentType = migration.editContentType(contentTypeName);

  contentType
    .createField('genre')
    .name('Themes')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['themePage'],
        },
      ],
      linkType: 'Entry',
    });

  contentType.changeFieldControl('genre', 'app', process.env.THEME_PAGE_SUGGEST_APP_ID, {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  migration.transformEntries({
    contentType: contentTypeName,
    from: ['relatedLink'],
    to: ['genre', 'relatedLink'],
    transformEntryForLocale: async(fields, locale) => {
      if (locale !== 'en-GB' || !fields.relatedLink) {
        return;
      }

      const genre = [];
      const relatedLink = [];
      for (const category of fields.relatedLink[locale]) {
        const theme = themes.find((theme) => category === `http://data.europeana.eu/concept/${theme.entityId}`);
        if (theme) {
          genre.push({
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: theme.sysId
            }
          });
        } else {
          relatedLink.push(category);
        }
      }

      return {
        genre,
        relatedLink
      };
    },
    shouldPublish: 'preserve'
  });
};
