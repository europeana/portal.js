const FIELDS = [
  {
    id: 'roleChair',
    name: 'Role - Chair',
    in: [
      'Article 14 Task Force',
      'Capacity Building Working Group',
      'Data Quality Committee Working Group',
      'Europeana Aggregators\' Forum Steering Group',
      'Europeana Foundation Advisory Board',
      'Europeana Foundation Supervisory Board',
      'Europeana Network Association Management Board',
      'Governance Working Group',
      'Heritage Acoustics Task Force'
    ]
  },
  {
    id: 'roleViceChair',
    name: 'Role - Vice-chair',
    in: [
      'Europeana Network Association Management Board'
    ]
  },
  {
    id: 'roleTreasurer',
    name: 'Role - Treasurer',
    in: [
      'Europeana Network Association Management Board'
    ]
  },
  {
    id: 'roleMember',
    name: 'Role - Member',
    in: [
      '\'Supporting the digital cultural heritage of Ukraine\' Working Group',
      'Article 14 Task Force',
      'Data Quality Committee Working Group',
      'Datasheets for Digital Cultural Heritage Working Group',
      'Environmental sustainability practice Task Force',
      'From shelf to data space Working Group',
      'Governance Working Group',
      'Heritage Acoustics Task Force',
      'IIIF & Europeana Working Group',
      'Innovative Operating Models Working Group'
    ]
  }
];

module.exports = function(migration) {
  const person = migration.editContentType('person');

  for (const field of FIELDS) {
    person
      .createField(field.id)
      .name(field.name)
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
            in: field.in
          }
        ]
      });

    person.changeFieldControl(field.id, 'builtin', 'tagEditor', {});
  }
};
