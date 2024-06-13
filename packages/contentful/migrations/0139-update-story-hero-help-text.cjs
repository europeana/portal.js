module.exports = function(migration) {
  const story = migration
    .editContentType('story');
  story.changeFieldControl('primaryImageOfPage', 'builtin', 'entryLinkEditor', {
    helpText: 'To use the whole width header: Images wider than 1000 px are required, others will be aligned with the content. For best quality it\'s advised to use images of at least 2,520 px width.'
  });
};
