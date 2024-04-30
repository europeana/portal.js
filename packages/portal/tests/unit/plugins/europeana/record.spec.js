import nock from 'nock';
import md5 from 'md5';
import EuropeanaRecordApi, { isEuropeanaRecordId, recordIdFromUrl } from '@/plugins/europeana/record';

const europeanaId = '/123/abc';
const apiEndpoint = `${europeanaId}.json`;

const edmIsShownAt = 'https://example.org';
const edmIsShownByWebResource = {
  about: 'https://example.org/doc.pdf',
  dcDescription: {
    'en': ['This is an example']
  },
  webResourceEdmRights: {
    'def': ['https://example.org']
  },
  ebucoreHasMimeType: 'application/pdf'
};
const edmHasViewWebResourceFirst = {
  about: 'https://example.org/image1.jpeg',
  ebucoreHasMimeType: 'image/jpeg',
  isNextInSequence: edmIsShownByWebResource.about
};
const edmHasViewWebResourceSecond = {
  about: 'https://example.org/image2.jpeg',
  ebucoreHasMimeType: 'image/jpeg',
  isNextInSequence: edmHasViewWebResourceFirst.about
};
const edmHasViewWebResourceThird = {
  about: 'https://example.org/unknown.bin',
  ebucoreHasMimeType: 'application.octet-stream',
  isNextInSequence: edmHasViewWebResourceSecond.about
};
const someOtherWebResource = {
  about: 'https://example.org/'
};
const type = 'TEXT';
const europeanaCollectionName = [
  '123_Collection'
];
const apiResponse = {
  success: true,
  object: {
    about: europeanaId,
    europeanaCollectionName,
    aggregations: [
      {
        about: `/aggregation/provider${europeanaId}`,
        edmIsShownAt,
        edmIsShownBy: edmIsShownByWebResource.about,
        hasView: [
          edmHasViewWebResourceSecond.about,
          edmHasViewWebResourceThird.about,
          edmHasViewWebResourceFirst.about
        ],
        webResources: [
          edmIsShownByWebResource,
          edmHasViewWebResourceSecond,
          edmHasViewWebResourceThird,
          edmHasViewWebResourceFirst,
          someOtherWebResource
        ]
      }
    ],
    europeanaAggregation: {
      edmLanguage: { def: ['de'] },
      edmRights: { def: ['https://example.org'] },
      edmPreview: 'https://example.org'
    },
    proxies: [
      {
        europeanaProxy: false,
        dcTitle: {
          'en': ['This is a title']
        },
        dcDescription: {
          'en': ['This is a description']
        }
      }
    ],
    agents: [
      {
        about: 'http://data.europeana.eu/agent/110088',
        prefLabel: { en: 'Johann Wolfgang von Goethe' },
        rdaGr2DateOfBirth: { def: '1749-08-28' }
      }
    ],
    concepts: [
      {
        about: 'http://data.europeana.eu/concept/190',
        prefLabel: { en: 'Art' },
        note: { en: ['Art is a diverse range of human activities and the products of those activities'] }
      }
    ],
    times: [
      {
        about: 'http://data.europeana.eu/timespan/20',
        prefLabel: { en: '20th-century' },
        note: { en: ['The 20th century'] }
      }
    ],
    type
  }
};

const translateProfileApiResponse = {
  success: true,
  object: {
    about: europeanaId,
    aggregations: [
      {
        about: `/aggregation/provider${europeanaId}`,
        edmIsShownAt,
        edmIsShownBy: edmIsShownByWebResource.about,
        hasView: [
          edmHasViewWebResourceSecond.about,
          edmHasViewWebResourceThird.about,
          edmHasViewWebResourceFirst.about
        ],
        webResources: [
          edmIsShownByWebResource,
          edmHasViewWebResourceSecond,
          edmHasViewWebResourceThird,
          edmHasViewWebResourceFirst,
          someOtherWebResource
        ]
      }
    ],
    europeanaAggregation: {
      edmLanguage: { def: ['de'] },
      edmRights: { def: ['https://example.org'] },
      edmPreview: 'https://example.org'
    },
    proxies: [
      {
        about: '/proxy/europeana/123/abc',
        europeanaProxy: true,
        dcFormat: {
          def: [
            'http://data.europeana.eu/concept/221'
          ]
        },
        dcTitle: {
          'de': ['Deutscher Titel']
        }
      },
      {
        about: '/proxy/aggregator/123/abc',
        europeanaProxy: false,
        dcDescription: {
          'de': ['Deutsche Beschreibung']
        },
        edmIsRelatedTo: {
          'def': ['http://data.europeana.eu/concept/190']
        }
      },
      {
        about: '/proxy/provider/123/abc',
        europeanaProxy: false,
        dcTitle: {
          'en': ['Provider title']
        },
        dcType: {
          'de': ['Deutscher Objekt Typ']
        }
      }
    ],
    agents: [
      {
        about: 'http://data.europeana.eu/agent/110088',
        prefLabel: { en: 'Johann Wolfgang von Goethe' },
        rdaGr2DateOfBirth: { def: '1749-08-28' }
      }
    ],
    concepts: [
      {
        about: 'http://data.europeana.eu/concept/190',
        prefLabel: { en: 'Art' },
        note: { en: ['Art is a diverse range of human activities and the products of those activities'] }
      },
      {
        about: 'http://data.europeana.eu/concept/221',
        prefLabel: { de: 'Aquarell' }
      }
    ],
    times: [
      {
        about: 'http://data.europeana.eu/timespan/20',
        prefLabel: { en: '20th-century' },
        note: { en: ['The 20th century'] }
      }
    ],
    type
  }
};

// const translateErrorApiResponse = {
//   success: false,
//   error: 'Translation limit quota exceeded.',
//   message: 'No more translations available today. Resource is exhausted',
//   code: '502-TS'
// };

describe('plugins/europeana/record', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('EuropeanaRecordApi', () => {
    it('is authenticating', () => {
      expect(EuropeanaRecordApi.AUTHENTICATING).toBe(true);
    });

    it('is authorising', () => {
      expect(EuropeanaRecordApi.AUTHORISING).toBe(true);
    });
  });

  describe('EuropeanaRecordApi().get()', () => {
    describe('when using the translation profile', () => {
      const translateConf = { $features: { translatedItems: true } };
      it('makes an API request', async() => {
        nock(EuropeanaRecordApi.BASE_URL)
          .get(apiEndpoint)
          .query(true)
          .reply(200, translateProfileApiResponse);

        await (new EuropeanaRecordApi(translateConf)).get(europeanaId);

        expect(nock.isDone()).toBe(true);
      });
      describe('profile parameter', () => {
        describe('when no translations are explicitly requested', () => {
          beforeEach(() => {
            nock(EuropeanaRecordApi.BASE_URL)
              .get(apiEndpoint)
              .query(query => !Object.keys(query).includes('profile'))
              .reply(200, translateProfileApiResponse);
          });

          it('is omitted when the item translation feature is enabled', async() => {
            await (new EuropeanaRecordApi(translateConf)).get(europeanaId);

            expect(nock.isDone()).toBe(true);
          });
          //
          // it('ignores language-specific metadata from the europeana proxy', async() => {
          //   const response = await (new EuropeanaRecordApi(translateConf)).get(europeanaId);
          //
          //   expect(response.record.title).toEqual({ en: ['Provider title'] });
          // });
          //
          // it('includes non-language-specific metadata from the europeana proxy', async() => {
          //   const response = await (new EuropeanaRecordApi(translateConf)).get(europeanaId);
          //
          //   expect(response.record.concepts[1]).toEqual({
          //     about: 'http://data.europeana.eu/concept/221',
          //     prefLabel: { de: 'Aquarell' }
          //   });
          // });
        });
        // describe('when translations are explicitly requested', () => {
        //   it('is "translate" when the item translation feature is enabled', async() => {
        //     nock(EuropeanaRecordApi.BASE_URL)
        //       .get(apiEndpoint)
        //       .query(query => query.profile === 'translate' && query.lang === 'de')
        //       .reply(200, translateProfileApiResponse);
        //
        //     await (new EuropeanaRecordApi(translateConf)).get(europeanaId, { metadataLanguage: 'de' });
        //
        //     expect(nock.isDone()).toBe(true);
        //   });
        //   describe('when the API returns a quota exhaustion error', () => {
        //     it('re-requests the record without the profile', async() => {
        //       nock(EuropeanaRecordApi.BASE_URL)
        //         .get(apiEndpoint)
        //         .query(query => query.profile === 'translate' && query.lang === 'de')
        //         .reply(502, translateErrorApiResponse);
        //       nock(EuropeanaRecordApi.BASE_URL)
        //         .get(apiEndpoint)
        //         .query(query => !Object.keys(query).includes('profile'))
        //         .reply(200, apiResponse);
        //
        //       await (new EuropeanaRecordApi(translateConf)).get(europeanaId, { metadataLanguage: 'de' });
        //
        //       expect(nock.isDone()).toBe(true);
        //     });
        //   });
        // });
      });
      // describe('metadadataLanguge', () => {
      //   it('uses the edmLanguage', async() => {
      //     nock(EuropeanaRecordApi.BASE_URL)
      //       .get(apiEndpoint)
      //       .query(query => query.profile === 'translate')
      //       .reply(200, translateProfileApiResponse);
      //
      //     const recordData = await (new EuropeanaRecordApi(translateConf)).get(europeanaId, { metadataLanguage: 'de' });
      //     expect(recordData.record.metadataLanguage).toBe('de');
      //     expect(nock.isDone()).toBe(true);
      //   });
      // });
      // describe('translation source labels', () => {
      //   describe('when there is a value in the Europeana proxy', () => {
      //     it('is considered an automated translation', async() => {
      //       nock(EuropeanaRecordApi.BASE_URL)
      //         .get(apiEndpoint)
      //         .query(query => query.profile === 'translate' && query.lang === 'de')
      //         .reply(200, translateProfileApiResponse);
      //
      //       const recordData = await (new EuropeanaRecordApi(translateConf)).get(europeanaId, { metadataLanguage: 'de' });
      //       expect(recordData.record.title.translationSource).toBe('automated');
      //       expect(nock.isDone()).toBe(true);
      //     });
      //   });
      //   describe('when there is a value in the aggregator proxy', () => {
      //     describe('when the value is in a lang map', () => {
      //       it('is considered an enrichment', async() => {
      //         nock(EuropeanaRecordApi.BASE_URL)
      //           .get(apiEndpoint)
      //           .query(query => query.profile === 'translate' && query.lang === 'de')
      //           .reply(200, translateProfileApiResponse);
      //
      //         const recordData = await (new EuropeanaRecordApi(translateConf)).get(europeanaId, { metadataLanguage: 'de' });
      //         expect(recordData.record.description.translationSource).toBe('enrichment');
      //         expect(nock.isDone()).toBe(true);
      //       });
      //     });
      //     describe('when the value refers to an entity', () => {
      //       it('is considered an enrichment', async() => {
      //         nock(EuropeanaRecordApi.BASE_URL)
      //           .get(apiEndpoint)
      //           .query(query => query.profile === 'translate' && query.lang === 'de')
      //           .reply(200, translateProfileApiResponse);
      //
      //         const recordData = await (new EuropeanaRecordApi(translateConf)).get(europeanaId, { metadataLanguage: 'de' });
      //         expect(recordData.record.metadata.edmIsRelatedTo.translationSource).toBe('enrichment');
      //         expect(nock.isDone()).toBe(true);
      //       });
      //     });
      //   });
      //   describe('when there is only a value in the default proxy', () => {
      //     it('does not flag the field with a translation source', async() => {
      //       nock(EuropeanaRecordApi.BASE_URL)
      //         .get(apiEndpoint)
      //         .query(query => query.profile === 'translate' && query.lang === 'de')
      //         .reply(200, translateProfileApiResponse);
      //
      //       const recordData = await (new EuropeanaRecordApi(translateConf)).get(europeanaId, { metadataLanguage: 'de' });
      //
      //       expect(recordData.record.metadata.dcType.translationSource === undefined).toBe(true);
      //       expect(nock.isDone()).toBe(true);
      //     });
      //   });
      // });
    });

    it('makes an API request', async() => {
      nock(EuropeanaRecordApi.BASE_URL)
        .get(apiEndpoint)
        .query(true)
        .reply(200, apiResponse);

      await (new EuropeanaRecordApi).get(europeanaId);

      expect(nock.isDone()).toBe(true);
    });

    describe('API response', () => {
      describe('with "Invalid record identifier: ..." error', () => {
        const errorMessage = `Invalid record identifier: ${europeanaId}`;

        beforeEach(() => {
          nock(EuropeanaRecordApi.BASE_URL)
            .get(apiEndpoint)
            .query(true)
            .reply(404, {
              success: false,
              error: errorMessage
            });
        });

        it('throws error with API error message and status code', async() => {
          let error;
          try {
            await (new EuropeanaRecordApi).get(europeanaId);
          } catch (e) {
            error = e;
          }

          expect(error.message).toBe(errorMessage);
          expect(error.statusCode).toBe(404);
        });
      });

      describe('with object in response', () => {
        beforeEach(() => {
          nock(EuropeanaRecordApi.BASE_URL)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns data from API', async() => {
          const response = await (new EuropeanaRecordApi).get(europeanaId);
          expect(response).toEqual(apiResponse);
        });

        // it('includes identifier', async() => {
        //   const response = await (new EuropeanaRecordApi).get(europeanaId);
        //   expect(response.record.identifier).toBe(europeanaId);
        // });
        //
        // it('includes edmIsShownAt', async() => {
        //   const response = await (new EuropeanaRecordApi).get(europeanaId);
        //   expect(response.record.isShownAt).toBe(edmIsShownAt);
        // });
        //
        // it('includes type', async() => {
        //   const response = await (new EuropeanaRecordApi).get(europeanaId);
        //   expect(response.record.type).toBe(type);
        // });
        //
        // it('includes europeanaCollectionName with link to search', async() => {
        //   const response = await (new EuropeanaRecordApi).get(europeanaId);
        //   expect(response.record.metadata.europeanaCollectionName.value).toEqual(europeanaCollectionName);
        //   expect(response.record.metadata.europeanaCollectionName.url).toEqual({
        //     name: 'search',
        //     query: { query: 'europeana_collectionName:"123_Collection"' }
        //   });
        // });
        //
        // describe('.media', () => {
        //   it('includes edmIsShownBy web resource', async() => {
        //     const response = await (new EuropeanaRecordApi).get(europeanaId);
        //     expect(response.record.media.find((item) => item.about === edmIsShownByWebResource.about)).toBeDefined();
        //   });
        //
        //   it('includes edmHasView web resource', async() => {
        //     const response = await (new EuropeanaRecordApi).get(europeanaId);
        //     for (const hasView of [edmHasViewWebResourceFirst, edmHasViewWebResourceSecond, edmHasViewWebResourceThird]) {
        //       expect(response.record.media.find((item) => item.about === hasView.about)).toBeDefined();
        //     }
        //   });
        //
        //   it('omits other web resources', async() => {
        //     const response = await (new EuropeanaRecordApi).get(europeanaId);
        //     expect(typeof response.record.media.find((item) => item.about === someOtherWebResource.about)).toBe('undefined');
        //   });
        //
        //   it('sorts by isNextInSequence', async() => {
        //     const response = await (new EuropeanaRecordApi).get(europeanaId);
        //
        //     expect(response.record.media[0].about).toBe(edmIsShownByWebResource.about);
        //     expect(response.record.media[1].about).toBe(edmHasViewWebResourceFirst.about);
        //     expect(response.record.media[2].about).toBe(edmHasViewWebResourceSecond.about);
        //     expect(response.record.media[3].about).toBe(edmHasViewWebResourceThird.about);
        //   });
        // });
        //
        // it('includes agents, reduced to about and prefLabel', async() => {
        //   const response = await (new EuropeanaRecordApi).get(europeanaId);
        //   const agent = response.record.agents[0];
        //   expect(Object.keys(agent)).toEqual(['about', 'prefLabel']);
        //   expect(agent.about).toEqual(apiResponse.object.agents[0].about);
        //   expect(agent.prefLabel).toEqual(apiResponse.object.agents[0].prefLabel);
        // });
        //
        // it('includes concepts, reduced to about and prefLabel', async() => {
        //   const response = await (new EuropeanaRecordApi).get(europeanaId);
        //   const concept = response.record.concepts[0];
        //   expect(Object.keys(concept)).toEqual(['about', 'prefLabel']);
        //   expect(concept.about).toEqual(apiResponse.object.concepts[0].about);
        //   expect(concept.prefLabel).toEqual(apiResponse.object.concepts[0].prefLabel);
        // });
      });
    });
  });

  describe('EuropeanaRecordApi().find()', () => {
    it('searches the Record API for specified item IDs', async() => {
      const ids = ['/123/abc', '/123/def'];
      nock(EuropeanaRecordApi.BASE_URL)
        .get('/search.json')
        .query(query => {
          return query.profile === 'minimal' &&
            !query.qf &&
            query.query === 'europeana_id:("/123/abc" OR "/123/def")';
        })
        .reply(200);

      await (new EuropeanaRecordApi).find(ids, { profile: 'minimal' });

      expect(nock.isDone()).toBe(true);
    });

    it('searches the Record API for specified item URIs', async() => {
      const uris = ['http://data.europeana.eu/item/123/abc', 'http://data.europeana.eu/item/123/def'];
      nock(EuropeanaRecordApi.BASE_URL)
        .get('/search.json')
        .query(query => {
          return !query.profile &&
            !query.qf &&
            query.query === 'europeana_id:("/123/abc" OR "/123/def")';
        })
        .reply(200);

      await (new EuropeanaRecordApi).find(uris);

      expect(nock.isDone()).toBe(true);
    });
  });

  describe('EuropeanaRecordApi().mediaProxyUrl()', () => {
    const europeanaId = '/123/abc';
    const mediaUrl = 'https://www.example.org/audio.ogg';

    it('uses origin https://proxy.europeana.eu', () => {
      const proxyUrl = new URL((new EuropeanaRecordApi).mediaProxyUrl(mediaUrl, europeanaId));

      expect(proxyUrl.origin).toBe('https://proxy.europeana.eu');
    });

    it('uses europeanaId & web resource hash as path', () => {
      const proxyUrl = new URL((new EuropeanaRecordApi).mediaProxyUrl(mediaUrl, europeanaId));

      expect(proxyUrl.pathname).toBe(`/media${europeanaId}/${md5(mediaUrl)}`);
    });

    it('sets recordApiUrl query param', () => {
      const proxyUrl = new URL((new EuropeanaRecordApi).mediaProxyUrl(mediaUrl, europeanaId));

      expect(proxyUrl.searchParams.get('recordApiUrl')).toBe('https://api.europeana.eu/record');
    });

    it('sets additional params from final arg', () => {
      const proxyUrl = new URL((new EuropeanaRecordApi).mediaProxyUrl(mediaUrl, europeanaId, { disposition: 'inline' }));

      expect(proxyUrl.searchParams.get('disposition')).toBe('inline');
    });
  });

  describe('isEuropeanaRecordId()', () => {
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

  describe('recordIdFromUrl()', () => {
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
