module.exports = function(migration) {
  const story = migration
    .editContentType('story');

  story.changeFieldControl('name', 'builtin', 'singleLine',  {
    helpText: 'To use the full screen header: The title should be max. 80 characters. Longer text will cause the default header to be displayed.'
  });

  story.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText: 'To use the full screen header: The subtitle is required and should be max. 140 characters. Longer text will cause the default header to be displayed. The subtitle is displayed below the title and is used for SEO.'
  });

  story.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Is displayed below the header. When there is NO subtitle: the description will be displayed below the title and is used for SEO.'
  });

  story.changeFieldControl('primaryImageOfPage', 'builtin', 'entryLinkEditor', {
    helpText: 'To use the full screen header: Images should be min. 800 px wide. Smaller images will cause the default header to be displayed. For best quality it\'s advised to use images of at least 2,520 px width.'
  });
};
