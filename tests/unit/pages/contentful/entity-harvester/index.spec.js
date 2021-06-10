import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '../../../../../src/pages/contentful/entity-harvester/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

// const contentfylExtensionSDKStub = sinon.stub();
// const contentfylEntryStub = sinon.stub();

//   dialogs: () => {
//     openPrompt: () => {
//       return userURL || 'UserURL';
//     };
//   };
// };

const entityResponse = {
  '@context': 'http://www.europeana.eu/schemas/context/entity.jsonld',
  id: 'http://data.europeana.eu/agent/base/20',
  type: 'Agent',
  isShownBy: {
    id: 'http://atena.beic.it/webclient/DeliveryManager?pid=1930631&custom_att_2=deeplink',
    type: 'WebResource',
    source: 'http://data.europeana.eu/item/9200369/webclient_DeliveryManager_pid_1930099_custom_att_2_simple_viewer',
    thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fatena.beic.it%2Fwebclient%2FDeliveryManager%3Fpid%3D1930631%26custom_att_2%3Ddeeplink&type=TEXT'
  },
  prefLabel: {
    de: 'Giovanni Francesco Straparola',
    en: 'Giovanni Francesco Straparola',
    es: 'Gianfrancesco Straparola',
    pt: 'Straparola',
    uk: 'Джованні Франческо Страпарола'
  },
  biographicalInformation: [
    {
      '@language': 'de',
      '@value': 'Giovanni Francesco Straparola (da Caravaggio) (* um 1480 in Caravaggio bei Bergamo; † um 1558 in Venedig ?) war ein italienischer Märchensammler Europas.'
    },
    {
      '@language': 'fi',
      '@value': 'Giovanni Francesco Straparola (n. 1480–1557) oli italialainen kirjailija ja satujen kerääjä. Straparolan pääteos on vuonna 1551 julkaistu kaksiosainen Le piacevoli notti, jossa on 75 tarinaa. Sen esikuvana on Boccaccion Decamerone, ja teoksessa on samankaltainen kehyskertomus; seurue kertoo toisilleen tarinoita. Tässä kertomuskokoelmassa on useita varhaisia versioita sittemmin tunnetuiksi tulleista saduista.'
    }
  ],
  sameAs: [
    'http://rdf.freebase.com/ns/m.03rc83',
    'http://pt.dbpedia.org/resource/Straparola'
  ]
};

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      contentfulExtensionSdk: null,
      entry: null,
      message: null
    };
  },
  mocks: {
    $t: key => key,
    $pageHeadTitle: key => key
    // contentfulExtensionSdk.dialogs.openPrompt: userURL || 'UserURL';
  }
});

const errorResponse = {
  action: '/entity/agent/base/20.json',
  success: false,
  error: 'There was an error'
};

describe('entity harvester', () => {
  const fakeExtension = () => {
    return { init: () => {} };
  };
  window.contentfulExtension = fakeExtension();

  sinon.stub(window.contentfulExtension, 'init');
  describe('mounting', () => {
    it('sets the SDK and entry', async() => {
      const wrapper = factory();
      const extensionSdk = wrapper.vm.contentfulExtensionSdk;
      const entry = wrapper.vm.entry;
      extensionSdk.should.eq(contentfulExpansionStub);
      entry.should.eql(expectedEntry);
    });
  });

  describe('methods', () => {
    const type = 'agent';
    const id = '20';

    describe('harvestEntity', () => {
      context('when the entity can be retrieved', () => {
        it('calls populateFields for the entity', () => {
          const wrapper = factory({ userURL: `http://data.europeana.eu/${type}/base/${id}` });
          const fakeAPI = sinon.replace(wrapper.vm.$apis.entity, 'getEntity', sinon.fake.returns(entityResponse));
          wrapper.vm.harvestEntity();
          wrapper.vm.populateFields.should.have.been.called;
          fakeAPI.callCount.should.eq(1);
        });
      });
      context('when the entity URL can NOT be parsed', () => {
        it('calls populateFields for the entity', () => {
          const wrapper = factory({ userURL: 'https://example.org/failure' });

          wrapper.vm.harvestEntity();
          wrapper.vm.populateFields.should.have.been.called;
          fakeAPI.callCount.should.eq(0);
        });
      });
      context('when the entity can NOT be retrieved', () => {
        it('shows an error for the URL', () => {
          const wrapper = factory({ userURL: `http://data.europeana.eu/${type}/base/${id}` });
          const fakeAPI = sinon.replace(wrapper.vm.$apis.entity, 'getEntity', sinon.fake.returns(errorResponse));

          wrapper.vm.harvestEntity();
          wrapper.vm.populateFields.should.not.have.been.called;
          fakeAPI.callCount.should.eq(1);
        });
      });
    }),

    describe('entityParamsFromUrl', () => {
      context('when the url is a europeana data URI', () => {
        it('returns the params split from the URI', () => {
          const wrapper = factory();

          wrapper.vm.entityParamsFromUrl(`http://data.europeana.eu/${type}/base/${id}`).should.eq({ type: 'person', id });
        });
      });

      context('when the url is a europeana api URL', () => {
        it('returns the params split from the URI', () => {
          const wrapper = factory();

          wrapper.vm.entityParamsFromUrl(`https://api.europeana.eu/entity/${type}/base/${id}`).should.eq({ type: 'person', id });
        });
      });

      context('when the url is a europeana portal collection page url', () => {
        it('returns the params split from the URI', () => {
          // type: 'agent' is person
          const wrapper = factory();

          wrapper.vm.entityParamsFromUrl(`https://www.europeana.eu/collections/person/${id}-giovnanni-francesco-straparola`).should.eq({ type: 'person', id });
        });
      });

      context('when the url is not a recognized format', () => {
        it('shows an error', () => {
          const wrapper = factory();
          wrapper.vm.entityParamsFromUrl('https://example.org').should.raiseError;
        });
      });
    });

    describe('showError', () => {
      it('uses a contetnful dialog and sets the message to failed', () => {
        const wrapper = factory();
        wrapper.vm.showError('this is the message');
        contentfulSDKstub.dialogs.openAlert.should.have.been.calledWith({ title: 'Error', message: 'this is the message' });
        wrapper.vm.message.should.eq('Failed');
      });
    });

    describe('populateFields', () => {
      const response = {
        id: `http://data.europeana.eu/${type}/base/${id}`,
        prefLabel: [
          {
            '@language': 'en',
            '@value': 'Giovnanni Francesco Straparola'
          }
        ],
        type: 'Agent',
        biographicalInformation: { en: 'Desc' },
        isShownBy: {
          thumbnail: 'thumbnailUrl'
        }
      };

      it('sets the field identifier', () => {
        const wrapper = factory();
        wrapper.vm.populateFields(response, id);
        wrapper.vm.entry.fields.identifer.setValue.should.have.been.calledWith(response.id);
      });

      context('when entry has a slug', () => {
        it('sets the entity Slug from the response', () => {
          const wrapper = factory();
          wrapper.vm.populateFields(response, id);
          wrapper.vm.entry.fields.slug.setValue.should.have.been.calledWith('20-giovnanni-francesco-straparola');
        });
      });

      context('when entry has a type', () => {
        it('sets the human readable entity type from the response', () => {
          const wrapper = factory();
          wrapper.vm.populateFields(response, id);
          wrapper.vm.entry.fields.type.setValue.should.have.been.calledWith('person');
        });
      });

      context('when entry has a name field', () => {
        it('sets the entity name from the response', () => {
          const wrapper = factory();
          wrapper.vm.populateFields(response, id);
          wrapper.vm.entry.fields.name.setValue.should.have.been.calledWith('Giovnanni Francesco Straparola');
        });
      });
      context('when entry has a description field', () => {
        it('sets the entity description from the response', () => {
          const wrapper = factory();
          wrapper.vm.populateFields(response, id);
          wrapper.vm.entry.fields.description.setValue.should.have.been.calledWith('Desc');
        });
      });
      context('when entry has an image field', () => {
        it('sets the image from the response isShownBy thumbnail', () => {
          const wrapper = factory();
          wrapper.vm.populateFields(response, id);
          wrapper.vm.entry.fields.image.setValue.should.have.been.calledWith('thumbnailUrl');
        });
      });
    }),

    describe('entityDescriptionFromResponse', () => {
      context('when entry is an Agent type entity', () => {
        const response = {
          type: 'Agent',
          biographicalInformation: { en: 'Bio' }
        };
        it('returns the description from the biographicalInformation', () => {
          const wrapper = factory();
          wrapper.vm.entityDescriptionFromResponse(response).should.eq('Bio');
        });
      });
      context('when entry is a Concept type entity', () => {
        const response = {
          type: 'Concept',
          note: { en: 'Note' }
        };
        it('returns the description from the note field', () => {
          const wrapper = factory();
          wrapper.vm.entityDescriptionFromResponse(response).should.eq('Note');
        });
      });
      context('when entry is an Organization type entity', () => {
        const response = {
          type: 'Organization',
          description: { en: 'Desc' }
        };
        it('returns the description from the descriptoin field', () => {
          const wrapper = factory();
          wrapper.vm.entityDescriptionFromResponse(response).should.eq('Desc');
        });
      });
      context('when entry is a Timespan type entity', () => {
        const response = {
          type: 'Timespan'
        };
        it('returns an empty string', () => {
          const wrapper = factory();
          wrapper.vm.entityDescriptionFromResponse(response).should.eq('');
        });
      });
      context('when entry is a Place type entity', () => {
        const response = {
          type: 'Place'
        };
        it('returns an empty string', () => {
          const wrapper = factory();
          wrapper.vm.entityDescriptionFromResponse(response).should.eq('');
        });
      });
    });
  });

  describe('head', () => {
    it('is Entity harvester - Contentful app', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      headMeta.find(meta => meta.property === 'title').content.should.eq('Entity harvester - Contentful app');
    });
  });
});
