import nock from 'nock';
import getRecord from '../../../../plugins/europeana/record';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const apiUrl = 'https://api.europeana.eu';
const apiEndpoint = '/api/v2/record/2024904/photography_ProvidedCHO_TopFoto_co_uk_EU017407.json';
const apiKey = 'abcdef';

describe('plugins/europeana/record', () => {
  describe('getRecord()', () => {
    it('gets the record data');

    describe('when trying to request an unknown record', () => {
      const errorMessage = 'Invalid record identifier';
      beforeEach('stub API response', () => {
        nock(apiUrl)
          .get(apiEndpoint)
          .query(true)
          .reply(400, {
            record: null,
            error: errorMessage
          });
      });

      it('returns API error message', () => {
        const response = getRecord({
          path: '2024904/photography_ProvidedCHO_TopFoto_co_uk_EU017407',
          key: apiKey
        });
        return response.should.eventually.have.property('error', errorMessage);
      });
    });

    describe('when trying to request a record', () => {

      const apiResponse = {
        success: true,
        result: { record:
          { image:
            { link: 'https://alink.eu',
              src: 'https://animage.eu' },
          fields:
            { dcCreator: [Object],
              dcDescription: [Object],
              dcTitle: [Object],
              dcType: [Object],
              dctermsCreated: [Object],
              edmCountry: [Object],
              edmDataProvider: [Object],
              edmLanguage: 'en',
              edmRights: [Object] },
          media: [ [Object], [Object] ] },
        error: null }
      };

      beforeEach('stub API response', () => {
        nock(apiUrl)
          .get(apiEndpoint)
          .query(true)
          .reply(200, apiResponse);
      });

      it('returns record data', () => {
        const response = getRecord({
          path: '2024904/photography_ProvidedCHO_TopFoto_co_uk_EU017407',
          key: apiKey
        });
        console.log(apiResponse.record);
        return response.should.eventually.have.property('record');
      });

    });

  });
});
