export const annotations = [
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
        en: ['May cause offense']
      }
    },
    target: {
      selector: {
        hasPredicate: 'dc:title', refinedBy: {
          exact: { '@language': 'en', '@value': 'offensive' },
          prefix: 'an ',
          suffix: ' word'
        }
      }
    }
  },
  {
    id: 'http://example.org/annotation/highlighting/3',
    motivation: 'highlighting',
    body: {
      id: 'http://example.org/c4p/2',
      definition: {
        en: ['May cause harm']
      }
    },
    target: [
      {
        selector: {
          hasPredicate: 'dc:title', refinedBy: {
            exact: { '@language': 'en', '@value': 'harmful' },
            prefix: 'a ',
            suffix: ' word'
          }
        }
      },
      {
        selector: {
          hasPredicate: 'dc:description', refinedBy: {
            exact: { '@language': 'en', '@value': 'harmful' },
            prefix: 'a ',
            suffix: ' word'
          }
        }
      }
    ]
  },
  {
    id: 'http://example.org/annotation/highlighting/2',
    motivation: 'highlighting',
    body: {
      id: 'http://example.org/vocabulary/debias/1',
      definition: {
        en: ['May cause contentiousness']
      }
    },
    target: {
      selector: {
        hasPredicate: 'dc:description', refinedBy: {
          exact: { '@language': 'en', '@value': 'contentious' },
          prefix: 'a ',
          suffix: ' word'
        }
      }
    }
  },
  {
    id: 'http://example.org/annotation/highlighting/2',
    motivation: 'highlighting',
    body: {
      id: 'http://example.org/vocabulary/debias/1',
      definition: {
        de: ['Kann Unhöflichkeit verursachen']
      }
    },
    target: {
      selector: {
        hasPredicate: 'dc:description',
        refinedBy: {
          exact: { '@language': 'de', '@value': 'unhöfliches' },
          prefix: 'ein ',
          suffix: ' Wort'
        }
      }
    }
  }
];
