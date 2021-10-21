import nock from 'nock';
import record, { isEuropeanaRecordId, BASE_URL } from '@/plugins/europeana/record';

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
const apiResponse = {
  success: true,
  object: {
    about: europeanaId,
    aggregations: [
      {
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
        about: 'http://data.europeana.eu/agent/base/110088',
        prefLabel: { en: 'Johann Wolfgang von Goethe' },
        rdaGr2DateOfBirth: { def: '1749-08-28' }
      }
    ],
    concepts: [
      {
        about: 'http://data.europeana.eu/concept/base/190',
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
        europeanaProxy: true,
        dcTitle: {
          'de': ['Deutscher Titel']
        }
      },
      {
        europeanaProxy: false,
        dcDescription: {
          'de': ['Deutsche Beschreibung']
        }
      },
      {
        europeanaProxy: false,
        dcType: {
          'de': ['Deutscher Objekt Typ']
        }
      }
    ],
    agents: [
      {
        about: 'http://data.europeana.eu/agent/base/110088',
        prefLabel: { en: 'Johann Wolfgang von Goethe' },
        rdaGr2DateOfBirth: { def: '1749-08-28' }
      }
    ],
    concepts: [
      {
        about: 'http://data.europeana.eu/concept/base/190',
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

const translateErrorApiResponse = {
  success: false,
  error: 'Translation limit quota exceeded.',
  message: 'No more translations available today. Resource is exhausted',
  code: '502-TS'
};

describe('plugins/europeana/record', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  context('when using the translation profile', () => {
    const translateConf = { $config: { app: { features: { translatedItems: true } } } };
    describe('record().getRecord()', () => {
      it('makes an API request', async() => {
        nock(BASE_URL)
          .get(apiEndpoint)
          .query(true)
          .reply(200, translateProfileApiResponse);

        await record(translateConf).getRecord(europeanaId);

        nock.isDone().should.be.true;
      });
      describe('profile parameter', () => {
        context('when no translations are explicitly requested', () => {
          it('is omitted when the item translation feature is enabled', async() => {
            nock(BASE_URL)
              .get(apiEndpoint)
              .query(query => !Object.keys(query).includes('profile'))
              .reply(200, apiResponse);

            await record(translateConf).getRecord(europeanaId);

            nock.isDone().should.be.true;
          });
        });
        context('when translations are explicitly requested', () => {
          it('is "translate" when the item translation feature is enabled', async() => {
            nock(BASE_URL)
              .get(apiEndpoint)
              .query(query => query.profile === 'translate' && query.lang === 'de')
              .reply(200, translateProfileApiResponse);

            await record(translateConf).getRecord(europeanaId, { metadataLanguage: 'de' });

            nock.isDone().should.be.true;
          });
          context('when the API returns a quota exhaustion error', () => {
            it('re-requests the record without the profile', async() => {
              nock(BASE_URL)
                .get(apiEndpoint)
                .query(query => query.profile === 'translate' && query.lang === 'de')
                .reply(502, translateErrorApiResponse);
              nock(BASE_URL)
                .get(apiEndpoint)
                .query(query => !Object.keys(query).includes('profile'))
                .reply(200, apiResponse);

              await record(translateConf).getRecord(europeanaId, { metadataLanguage: 'de' });

              nock.isDone().should.be.true;
            });
          });
        });
      });
      describe('metadadataLanguge', () => {
        it('uses the edmLanguage', async() => {
          nock(BASE_URL)
            .get(apiEndpoint)
            .query(query => query.profile === 'translate')
            .reply(200, translateProfileApiResponse);

          const recordData = await record(translateConf).getRecord(europeanaId, { metadataLanguage: 'de' });
          recordData.record.metadataLanguage.should.eq('de');
          nock.isDone().should.be.true;
        });
      });
      describe('translation source labels', () => {
        context('when there is a value in the Europeana proxy', () => {
          it('is considered an automated translation', async() => {
            nock(BASE_URL)
              .get(apiEndpoint)
              .query(query => query.profile === 'translate' && query.lang === 'de')
              .reply(200, translateProfileApiResponse);

            const recordData = await record(translateConf).getRecord(europeanaId, { metadataLanguage: 'de' });
            recordData.record.title.translationSource.should.eq('automated');
            nock.isDone().should.be.true;
          });
        });
        context('when there is a value in the provider proxy', () => {
          it('is considered an automated translation', async() => {
            nock(BASE_URL)
              .get(apiEndpoint)
              .query(query => query.profile === 'translate' && query.lang === 'de')
              .reply(200, translateProfileApiResponse);

            const recordData = await record(translateConf).getRecord(europeanaId, { metadataLanguage: 'de' });
            recordData.record.description.translationSource.should.eq('enrichment');
            nock.isDone().should.be.true;
          });
        });
        context('when there is only a value in the default proxy', () => {
          it('does not flag the field with a translation source', async() => {
            nock(BASE_URL)
              .get(apiEndpoint)
              .query(query => query.profile === 'translate' && query.lang === 'de')
              .reply(200, translateProfileApiResponse);

            const recordData = await record(translateConf).getRecord(europeanaId, { metadataLanguage: 'de' });

            (recordData.record.metadata.dcType.translationSource === undefined).should.be.true;
            nock.isDone().should.be.true;
          });
        });
      });
    });
  });

  describe('record().getRecord()', () => {
    it('makes an API request', async() => {
      nock(BASE_URL)
        .get(apiEndpoint)
        .query(true)
        .reply(200, apiResponse);

      await record().getRecord(europeanaId);

      nock.isDone().should.be.true;
    });

    describe('profile parameter', () => {
      it('is "schemaOrg" for configured dataset items', async() => {
        nock(BASE_URL)
          .get(apiEndpoint)
          .query(query => query.profile === 'schemaOrg')
          .reply(200, apiResponse);

        await record({ $config: { app: { schemaOrgDatasetId: '123' } } }).getRecord(europeanaId);

        nock.isDone().should.be.true;
      });

      it('is omitted for other dataset items', async() => {
        nock(BASE_URL)
          .get(apiEndpoint)
          .query(query => !Object.keys(query).includes('profile'))
          .reply(200, apiResponse);

        await record({ $config: { app: { schemaOrgDatasetId: '456' } } }).getRecord(europeanaId);

        nock.isDone().should.be.true;
      });
    });

    describe('API response', () => {
      describe('with "Invalid record identifier: ..." error', () => {
        const errorMessage = `Invalid record identifier: ${europeanaId}`;

        beforeEach('stub API response', () => {
          nock(BASE_URL)
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
            await record().getRecord(europeanaId);
          } catch (e) {
            error = e;
          }

          error.message.should.eq(errorMessage);
          error.statusCode.should.eq(404);
        });
      });

      describe('with object in response', () => {
        beforeEach('stub API response', () => {
          nock(BASE_URL)
            .get(apiEndpoint)
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns record data', async() => {
          const response = await record().getRecord(europeanaId);
          response.record.should.exist;
        });

        it('includes identifier', async() => {
          const response = await record().getRecord(europeanaId);
          response.record.identifier.should.eq(europeanaId);
        });

        it('includes edmIsShownAt', async() => {
          const response = await record().getRecord(europeanaId);
          response.record.isShownAt.should.eq(edmIsShownAt);
        });

        it('includes type', async() => {
          const response = await record().getRecord(europeanaId);
          response.record.type.should.eq(type);
        });

        describe('.media', () => {
          it('includes edmIsShownBy web resource', async() => {
            const response = await record().getRecord(europeanaId);
            response.record.media.find((item) => item.about === edmIsShownByWebResource.about).should.exist;
          });

          it('includes edmHasView web resource', async() => {
            const response = await record().getRecord(europeanaId);
            for (const hasView of [edmHasViewWebResourceFirst, edmHasViewWebResourceSecond, edmHasViewWebResourceThird]) {
              response.record.media.find((item) => item.about === hasView.about).should.exist;
            }
          });

          it('omits other web resources', async() => {
            const response = await record().getRecord(europeanaId);
            (typeof response.record.media.find((item) => item.about === someOtherWebResource.about)).should.eq('undefined');
          });

          it('sorts by isNextInSequence', async() => {
            const response = await record().getRecord(europeanaId);

            response.record.media[0].about.should.eq(edmIsShownByWebResource.about);
            response.record.media[1].about.should.eq(edmHasViewWebResourceFirst.about);
            response.record.media[2].about.should.eq(edmHasViewWebResourceSecond.about);
            response.record.media[3].about.should.eq(edmHasViewWebResourceThird.about);
          });

          describe('injected thumbnail URLs', () => {
            context('when item has a supported MIME type', () => {
              const item = edmHasViewWebResourceFirst;
              it('includes item-specific-type thumbnails', async() => {
                const expectedThumbnails = {
                  small: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w200&type=IMAGE&uri=https%3A%2F%2Fexample.org%2Fimage1.jpeg',
                  large: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fexample.org%2Fimage1.jpeg'
                };

                const response = await record().getRecord(europeanaId);
                const actualThumbnails = response.record.media.find((m) => m.about === item.about).thumbnails;

                actualThumbnails.should.deep.eq(expectedThumbnails);
              });
            });

            context('when item has an unsupported MIME type', () => {
              const item = edmHasViewWebResourceThird;
              it('includes record-type thumbnails', async() => {
                const expectedThumbnails = {
                  small: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w200&type=TEXT&uri=https%3A%2F%2Fexample.org%2Funknown.bin',
                  large: 'https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=TEXT&uri=https%3A%2F%2Fexample.org%2Funknown.bin'
                };

                const response = await record().getRecord(europeanaId);
                const actualThumbnails = response.record.media.find((m) => m.about === item.about).thumbnails;

                actualThumbnails.should.deep.eq(expectedThumbnails);
              });
            });
          });
        });

        it('includes agents, reduced to about and prefLabel', async() => {
          const response = await record().getRecord(europeanaId);
          const agent = response.record.agents[0];
          Object.keys(agent).should.eql(['about', 'prefLabel']);
          agent.about.should.eql(apiResponse.object.agents[0].about);
          agent.prefLabel.should.eql(apiResponse.object.agents[0].prefLabel);
        });

        it('includes concepts, reduced to about and prefLabel', async() => {
          const response = await record().getRecord(europeanaId);
          const concept = response.record.concepts[0];
          Object.keys(concept).should.eql(['about', 'prefLabel']);
          concept.about.should.eql(apiResponse.object.concepts[0].about);
          concept.prefLabel.should.eql(apiResponse.object.concepts[0].prefLabel);
        });
      });
    });
  });

  describe('record().mediaProxyUrl()', () => {
    const europeanaId = '/123/abc';
    const mediaUrl = 'https://www.example.org/audio.ogg';

    it('uses origin https://proxy.europeana.eu', () => {
      const proxyUrl = new URL(record().mediaProxyUrl(mediaUrl, europeanaId));

      proxyUrl.origin.should.eq('https://proxy.europeana.eu');
    });

    it('uses europeanaId as path', () => {
      const proxyUrl = new URL(record().mediaProxyUrl(mediaUrl, europeanaId));

      proxyUrl.pathname.should.eq(europeanaId);
    });

    it('uses web resource URI as view param', () => {
      const proxyUrl = new URL(record().mediaProxyUrl(mediaUrl, europeanaId));

      proxyUrl.searchParams.get('view').should.eq(mediaUrl);
    });

    it('uses store Record API origin as api_url param', () => {
      const proxyUrl = new URL(record().mediaProxyUrl(mediaUrl, europeanaId));

      proxyUrl.searchParams.get('api_url').should.eq('https://api.europeana.eu/api');
    });

    it('sets additional params from final arg', () => {
      const proxyUrl = new URL(record().mediaProxyUrl(mediaUrl, europeanaId, { disposition: 'inline' }));

      proxyUrl.searchParams.get('disposition').should.eq('inline');
    });
  });

  describe('record().relatedEntities()', () => {
    const entityUri = 'http://data.europeana.eu/concept/base/94';
    const entityFilterField = 'skos_concept';
    const entityId = '94-architecture';
    const entityType = 'topic';

    const searchResponse = {
      facets: [
        {
          name: 'skos_concept',
          fields: [
            { label: 'http://data.europeana.eu/agent/base/147831' },
            { label: 'http://data.europeana.eu/agent/base/49928' }
          ]
        }
      ]
    };

    it('filters on entity URI', async() => {
      nock(BASE_URL)
        .get('/search.json')
        .query(query => query.query === `${entityFilterField}:"${entityUri}"`)
        .reply(200, searchResponse);

      await record().relatedEntities(entityType, entityId);

      nock.isDone().should.be.true;
    });
  });

  describe('isEuropeanaRecordId()', () => {
    context('with valid record ID', () => {
      it('returns `true`', () => {
        const recordId = '/123456/abcdef_7890';

        const validation = isEuropeanaRecordId(recordId);

        validation.should.equal(true);
      });
    });

    context('with invalid record ID', () => {
      it('returns `false`', () => {
        const recordId = 'http://www.example.org/123456/abcdef_7890';

        const validation = isEuropeanaRecordId(recordId);

        validation.should.equal(false);
      });
    });
  });
});
