module.exports = function(migration) {
  const blogPosting = migration.editContentType('blogPosting');
  blogPosting
    .editField('genre')
    .items({
      type: 'Symbol',

      validations: [
        {
          in: [
            'Archaeology',
            'Art',
            'Behind the scenes',
            'Competitions',
            'European Year Of Cultural Heritage',
            'Europeana',
            'Europeana 1914-1918',
            'Europeana 1989',
            'Fashion',
            'Featured',
            'History',
            'Industrial Heritage',
            'Inspired by Europeana',
            'Judaica',
            'Manuscripts',
            'Maps and Geography',
            'Migration',
            'Music',
            'Natural History',
            'News',
            'Newspapers',
            'Photography',
            'Sport'
          ]
        }
      ]
    });
};
