module.exports = function(migration) {
  const zohoContact = migration
    .createContentType('zohoContact')
    .name('Zoho contact')
    .description('Created/updated automatically from Zoho CRM contact records')
    .displayField('name');

  zohoContact
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  zohoContact
    .createField('identifier')
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

  zohoContact
    .createField('image')
    .name('Image')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  zohoContact
    .createField('email')
    .name('Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  zohoContact
    .createField('title')
    .name('Job Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  zohoContact
    .createField('linkedInUrl')
    .name('LinkedIn URL')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  zohoContact
    .createField('country')
    .name('Country')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  zohoContact
    .createField('communities')
    .name('Communities')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  zohoContact
    .createField('participation')
    .name('Participation')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  zohoContact
    .createField('roleChair')
    .name('Role - Chair')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  zohoContact
    .createField('roleViceChair')
    .name('Role - Vice-chair')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  zohoContact
    .createField('roleTreasurer')
    .name('Role - Treasurer')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  zohoContact
    .createField('roleMember')
    .name('Role - Member')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  zohoContact.changeFieldControl('name', 'builtin', 'singleLine', {});
  zohoContact.changeFieldControl('identifier', 'builtin', 'singleLine', {});
  zohoContact.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
  zohoContact.changeFieldControl('email', 'builtin', 'singleLine', {});
  zohoContact.changeFieldControl('title', 'builtin', 'singleLine', {});
  zohoContact.changeFieldControl('linkedInUrl', 'builtin', 'singleLine', {});
  zohoContact.changeFieldControl('country', 'builtin', 'singleLine', {});
  zohoContact.changeFieldControl('communities', 'builtin', 'tagEditor', {});
  zohoContact.changeFieldControl('participation', 'builtin', 'tagEditor', {});
  zohoContact.changeFieldControl('roleChair', 'builtin', 'tagEditor', {});
  zohoContact.changeFieldControl('roleViceChair', 'builtin', 'tagEditor', {});
  zohoContact.changeFieldControl('roleTreasurer', 'builtin', 'tagEditor', {});
  zohoContact.changeFieldControl('roleMember', 'builtin', 'tagEditor', {});
};
