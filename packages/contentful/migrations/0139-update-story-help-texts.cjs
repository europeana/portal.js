module.exports = function(migration) {
  const story = migration
    .editContentType('story');

  story.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'Max. 80 characters. Longer text will cause the narrow header to be displayed.'
  });

  story.changeFieldControl('headline', 'builtin', 'singleLine', {
    helpText: 'Max. 140 characters. Longer text will cause the narrow header to be displayed.'
  });

  story.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Displayed below the header.'
  });

  story.changeFieldControl('primaryImageOfPage', 'builtin', 'entryLinkEditor', {
    helpText: 'Min. 1,000 pixels wide to display the full-screen header.'
  });
};
