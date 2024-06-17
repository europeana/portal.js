module.exports = function(migration) {
  const story = migration
    .editContentType('story');

  story.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'To use the full screen header: The title should be max. 80 characters.'
  });

  story.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText: 'To use the full screen header: The subtitle should be max. 140 characters.'
  });

  story.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: ''
  });

  story.changeFieldControl('primaryImageOfPage', 'builtin', 'entryLinkEditor', {
    helpText: 'To use the full screen header: Images wider than 1000 px are required.'
  });
};
