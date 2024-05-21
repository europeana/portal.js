import {
  isEuropeanaRecordId,
  recordIdFromUrl
} from '@/utils/europeana/record.js';

describe('@utils/europeana/record.js', () => {
  describe('isEuropeanaRecordId', () => {
    describe('with valid record ID', () => {
      it('returns `true`', () => {
        const recordId = '/123456/abcdef_7890';

        const validation = isEuropeanaRecordId(recordId);

        expect(validation).toBe(true);
      });
    });

    describe('with invalid record ID', () => {
      it('returns `false`', () => {
        const recordId = 'http://www.example.org/123456/abcdef_7890';

        const validation = isEuropeanaRecordId(recordId);

        expect(validation).toBe(false);
      });
    });
  });

  describe('recordIdFromUrl', () => {
    const supportedFormats = [
      '/90402/SK_A_2344',
      'http://data.europeana.eu/item/90402/SK_A_2344',
      'https://www.europeana.eu/en/item/90402/SK_A_2344'
    ];

    for (const format of supportedFormats) {
      it(`is able to parse an identifer from ${format}`, () => {
        const result = recordIdFromUrl(format);
        expect(result).toBe('/90402/SK_A_2344');
      });
    }

    it('returns undefined when the format is not supported', () => {
      const result = recordIdFromUrl('Unsupported format');
      expect(result).toBe(undefined);
    });
  });
});
