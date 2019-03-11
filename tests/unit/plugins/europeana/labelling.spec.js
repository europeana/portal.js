import fieldLabel from '../../../../plugins/europeana/labelling';


describe('plugins/europeana/record', () => {
  describe('fieldLabel()', () => {
    const availableFields = [
      'dcTitle',
      'dcType',
      'edmCountry',
      'dctermsCreated',
      'edmDataProvider',
      'edmRights',
      'dcContributor',
      'dcCreator',
      'dcDescription'
    ];

    describe('looking up an available key', () => {
      for (let key of availableFields) {
        describe(`for ${key}'`, () => {
          it('looks up the label from the fieldLabels object', () => {
            return fieldLabel(key).should.not.eq(key);
          });
        });
      }
    });

    describe('looking up a non available key', () => {
      describe('for rdfAbout', () => {
        it('returns the key as is', () => {
          return fieldLabel('rdfAbout').should.eq('rdfAbout');
        });
      });
    });

    describe('using a specific context', () => {
      describe('looking up a context specific key', () => {
        describe('for edmRights in webResource', () => {
          it('looks up the label from the webResource context', () => {
            return fieldLabel('edmRights', { context: 'webResource' }).should.eq('License for this media resource');
          });
        });

        describe('looking up a non existent context', () => {
          describe('for dcDescription in notAContext', () => {
            it('looks up the label from the default context', () => {
              return fieldLabel('dcDescription', { context: 'notAContext' }).should.eq('Description');
            });
          });
        });
      });

      describe('looking up a key available only in the default context', () => {
        describe('for dcDescription in webResource', () => {
          it('looks up the label from the default context', () => {
            return fieldLabel('dcDescription', { context: 'webResource' }).should.eq('Description');
          });
        });
      });

      describe('looking up a non available key', () => {
        describe('for rdfAbout', () => {
          it('returns the key as is', () => {
            return fieldLabel('rdfAbout', { context: 'webResource' }).should.eq('rdfAbout');
          });
        });
      });
    });

    // Specific value tests.
    describe('for dcTitle', () => {
      it('looks up the label from the fieldLabels object', () => {
        return fieldLabel('dcTitle').should.eq('Title');
      });
    });
    describe('for dcType', () => {
      it('looks up the label from the fieldLabels object', () => {
        return fieldLabel('dcType').should.eq('Type of object');
      });
    });
    describe('for edmDataProvider', () => {
      it('looks up the label from the fieldLabels object', () => {
        return fieldLabel('edmDataProvider').should.eq('Providing institution');
      });
    });
    describe('for edmRights', () => {
      it('looks up the label from the fieldLabels object', () => {
        return fieldLabel('edmRights').should.eq('License of the media in this record (unless otherwise specified)');
      });
    });
    describe('for dcDescription', () => {
      it('looks up the label from the fieldLabels object', () => {
        return fieldLabel('dcDescription').should.eq('Description');
      });
    });

  });
});
