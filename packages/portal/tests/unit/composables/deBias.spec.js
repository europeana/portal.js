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
      selector: { refinedBy: { exact: { '@language': 'en', '@value': 'offensive' } } }
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
      { selector: { refinedBy: { exact: { '@language': 'en', '@value': 'harmful' } } } },
      { selector: { refinedBy: { exact: { '@language': 'en', '@value': 'harmful' } } } }
    ]
  }
];

describe('useDeBias', () => {
  it('extracts terms to highlight from DeBias annotations', () => {
    const { termsToHighlight } = useDeBias(annotations);

    expect(termsToHighlight.value).toEqual(['offensive', 'harmful']);
  });

  describe('highlight', () => {
    it('removes highlighted term from those to highlight', () => {
      const { highlight, termsToHighlight } = useDeBias(annotations);

      highlight('offensive');

      expect(termsToHighlight.value).toEqual(['harmful']);
    });
  });

  describe('definitionOfTerm', () => {
    it('gets the term definition', () => {
      const { definitionOfTerm } = useDeBias(annotations);

      const definition = definitionOfTerm('offensive');

      expect(definition).toBe('May cause offense');
    });
  });
});
