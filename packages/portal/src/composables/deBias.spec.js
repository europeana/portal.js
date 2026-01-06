import useDeBias from '@/composables/deBias.js';
import { annotations } from './deBias.fixtures.js';

describe('useDeBias', () => {
  describe('parseAnnotations', () => {
    it('extracts term selectors to highlight from DeBias annotations', () => {
      const { parseAnnotations, terms } = useDeBias();

      parseAnnotations(annotations, { lang: 'en' });

      expect(terms.value).toEqual(
        {
          'dcDescription': [
            { exact: 'contentious', prefix: 'a ', suffix: ' word' }
          ],
          'dcTitle': [
            { exact: 'offensive', prefix: 'an ', suffix: ' word' },
            { exact: 'harmful', prefix: 'a ', suffix: ' word' }
          ]
        }
      );
    });
  });

  describe('definitions', () => {
    it('gets the term definition', () => {
      const { definitions } = useDeBias({ annotations, lang: 'en' });

      const definition = definitions.value['offensive'];

      expect(definition).toBe('May cause offense');
    });
  });
});
