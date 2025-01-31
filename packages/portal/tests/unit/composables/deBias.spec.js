import useDeBias from '@/composables/deBias.js';

const annotations = [
  {
    id: 'http://example.org/annotation/tagging/1',
    motivation: 'tagging'
  },
  {
    id: 'http://example.org/annotation/highlighting/1',
    motivation: 'highlighting'
  },
  {
    id: 'http://example.org/annotation/highlighting/2',
    motivation: 'highlighting',
    body: {
      id: 'http://example.org/vocabulary/debias/1',
      definition: {
        en: 'May cause offense'
      }
    },
    target: {
      selector: { hasPredicate: 'dcTitle', refinedBy: { exact: { '@language': 'en', '@value': 'offensive' } } }
    }
  },
  {
    id: 'http://example.org/annotation/highlighting/3',
    motivation: 'highlighting',
    body: {
      id: 'http://example.org/vocabulary/debias/2',
      definition: {
        en: 'May cause harm'
      }
    },
    target: [
      { selector: { hasPredicate: 'dcTitle', refinedBy: { exact: { '@language': 'en', '@value': 'harmful' } } } },
      { selector: { hasPredicate: 'dcDescription', refinedBy: { exact: { '@language': 'en', '@value': 'harmful' } } } }
    ]
  },
  {
    id: 'http://example.org/annotation/highlighting/2',
    motivation: 'highlighting',
    body: {
      id: 'http://example.org/vocabulary/debias/1',
      definition: {
        en: 'May cause contentiousness'
      }
    },
    target: {
      selector: { hasPredicate: 'dcDescription', refinedBy: { exact: { '@language': 'en', '@value': 'contentious' } } }
    }
  }
];

describe('useDeBias', () => {
  describe('parseAnnotations', () => {
    it('extracts terms to highlight from DeBias annotations', () => {
      const { parseAnnotations, terms } = useDeBias();

      parseAnnotations(annotations);

      expect(terms.value).toEqual(
        { dcDescription: ['contentious'], dcTitle: ['offensive', 'harmful'] }
      );
    });
  });

  describe('definitionOfTerm', () => {
    it('gets the term definition', () => {
      const { definitionOfTerm } = useDeBias(annotations);

      const definition = definitionOfTerm('offensive');

      expect(definition).toBe('May cause offense');
    });
  });

  describe('termsToHighlight', () => {
    it('gets field-specific terms to highlight, avoiding duplicates', () => {
      const { termsToHighlight } = useDeBias(annotations);

      const titleTerms = termsToHighlight('dcTitle');
      const descriptionTerms = termsToHighlight('dcDescription');

      expect(titleTerms).toEqual(['offensive', 'harmful']);
      expect(descriptionTerms).toEqual(['contentious']);
    });
  });
});
