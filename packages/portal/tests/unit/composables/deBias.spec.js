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
      selector: { hasPredicate: 'dc:title', refinedBy: { exact: { '@language': 'en', '@value': 'offensive' } } }
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
      { selector: { hasPredicate: 'dc:title', refinedBy: { exact: { '@language': 'en', '@value': 'harmful' } } } },
      { selector: { hasPredicate: 'dc:description', refinedBy: { exact: { '@language': 'en', '@value': 'harmful' } } } }
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
      selector: { hasPredicate: 'dc:description', refinedBy: { exact: { '@language': 'en', '@value': 'contentious' } } }
    }
  },
  {
    id: 'http://example.org/annotation/highlighting/2',
    motivation: 'highlighting',
    body: {
      id: 'http://example.org/vocabulary/debias/1',
      definition: {
        de: 'nein'
      }
    },
    target: {
      selector: { hasPredicate: 'dc:description', refinedBy: { exact: { '@language': 'de', '@value': 'nein' } } }
    }
  }
];

describe('useDeBias', () => {
  describe('parseAnnotations', () => {
    it('extracts terms to highlight from DeBias annotations', () => {
      const { parseAnnotations, terms } = useDeBias();

      parseAnnotations(annotations, { lang: 'en' });

      expect(terms.value).toEqual(
        { 'dc:description': ['contentious'], 'dc:title': ['offensive', 'harmful'] }
      );
    });
  });

  describe('definitionOfTerm', () => {
    it('gets the term definition', () => {
      const { definitionOfTerm } = useDeBias({ annotations, lang: 'en' });

      const definition = definitionOfTerm('offensive');

      expect(definition).toBe('May cause offense');
    });
  });

  describe('termsToHighlight', () => {
    it('gets field-specific terms to highlight, avoiding duplicates', () => {
      const { termsToHighlight } = useDeBias({ annotations, lang: 'en' });

      const titleTerms = termsToHighlight('dc:title');
      const descriptionTerms = termsToHighlight('dc:description');

      expect(titleTerms).toEqual(['offensive', 'harmful']);
      expect(descriptionTerms).toEqual(['contentious']);
    });
  });
});
