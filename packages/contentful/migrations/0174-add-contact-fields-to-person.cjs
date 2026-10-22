
module.exports = function(migration) {
  const person = migration.editContentType('person');

  person
    .createField('image')
    .name('Image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  person
    .createField('email')
    .name('Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  person
    .createField('title')
    .name('Job Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  person
    .createField('participationLevel')
    .name('Contact participation')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          in: [
            'Staff',
            'Network Association',
            'Members Council',
            'Management Board',
            'Advisory Board',
            'Supervisory Board',
            'Aggregators Forum',
          ],
        },
      ],
    });

  person
    .createField('zohoId')
    .name('Zoho CRM ID')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  person.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
  person.changeFieldControl('email', 'builtin', 'singleLine', {});
  person.changeFieldControl('title', 'builtin', 'singleLine', {});
  person.changeFieldControl('participationLevel', 'builtin', 'tagEditor', {});
  person.changeFieldControl('zohoId', 'builtin', 'singleLine', {});
};
