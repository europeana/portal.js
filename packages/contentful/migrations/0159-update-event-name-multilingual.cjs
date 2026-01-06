module.exports = function (migration) {
  const event = migration
    .editContentType('event');

  event
    .editField('name')
    .localized(true);
};
