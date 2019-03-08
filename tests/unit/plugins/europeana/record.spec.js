import nock from 'nock';
import getRecord, { fieldLabel } from '../../../../plugins/europeana/record';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const europeanaId = '/123/abc';
const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = `/api/v2/record${europeanaId}.json`;
const apiKey = 'abcdef';

describe('plugins/europeana/record', () => {
  describe('getRecord()', () => {

    describe('when trying to request an unknown record', () => {
      const errorMessage = `Invalid record identifier: ${europeanaId}`;

      beforeEach('stub API response', () => {
        nock(apiUrl)
          .get(apiEndpoint)
          .query(true)
          .reply(404, {
            success: false,
            error: errorMessage
          });
      });

      it('throws API error message', () => {
        const response = getRecord(europeanaId, { wskey: apiKey });

        return response.should.be.rejectedWith(errorMessage);
      });
    });

    describe('when trying to request a record', () => {
      const apiResponse = {
        success: true,
        object: {
          aggregations: [{
            edmIsShownAt: 'https://example.org',
            webResources: [{
              about: 'https://example.org',
              dcDescription: {
                'en': [
                  'This is an example'
                ]
              },
              webResourceEdmRights: {
                'def': [
                  'https://example.org'
                ]
              }
            }]
          }],
          europeanaAggregation: {
            edmRights: { def: [ 'https://example.org' ] },
            edmPreview: 'https://example.org'
          },
          proxies: [{
            europeanaProxy: false,
            dcTitle: {
              'en': [
                'This is a title'
              ]
            },
            dcDescription: {
              'en': [
                'This is a description'
              ]
            }
          }]
        }
      };

      beforeEach('stub API response', () => {
        nock(apiUrl)
          .get(apiEndpoint)
          .query(true)
          .reply(200, apiResponse);
      });

      it('returns record data', () => {
        const response = getRecord(europeanaId, { wskey: apiKey });

        return response.should.eventually.have.property('record');
      });
    });
  });

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
