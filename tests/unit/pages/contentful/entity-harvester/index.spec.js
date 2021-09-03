import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/entity-harvester/index';
import sinon from 'sinon';
import { apiError } from '@/plugins/europeana/utils';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const entityResponse = {
  error: null,
  entity: {
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
  }
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
    $pageHeadTitle: key => key,
    $apis: {
      entity: {
        getEntity: sinon.spy()
      }
    }
  }
});

const responseError = {
  response: {
    data: {
      action: '/entity/agent/base/20.json',
      success: false,
      error: 'There was an error',
      status: 500
    }
  }
};

const entityFields = ['identifier', 'slug', 'type', 'name', 'description', 'image'];

describe('entity harvester', () => {
  before('supply fake contentful extension', () => {
    window.contentfulExtension = fakeContentfulExtension(entityFields);
  });

  describe('mounting', () => {
    it('sets entry with all expected fields from the SDK', async() => {
      const wrapper = factory();
      const extensionSdk = wrapper.vm.contentfulExtensionSdk;
      extensionSdk.should.exist;
      const entry = wrapper.vm.entry;

      entityFields.forEach(field => {
        Object.keys(entry.fields).should.contain(field);
      });
    });
  });

  describe('methods', () => {
    const type = 'agent';
    const id = '20';

    describe('harvestEntity', () => {
      context('when the entity can be retrieved', () => {
        it('calls populateFields for the entity', async() => {
          const wrapper = factory();
          sinon.replaceGetter(wrapper.vm.$apis.entity, 'getEntity', () => {
            return sinon.fake.returns(entityResponse);
          });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(`http://data.europeana.eu/${type}/base/${id}`));
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestEntity();
          wrapper.vm.populateFields.should.have.been.called;
          wrapper.vm.message.should.eq('Success');
        });
      });
      context('when the entity URL can NOT be parsed', () => {
        it('shows an error for the URL', async() => {
          const wrapper = factory();
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns('https://example.org/failure'));
          wrapper.vm.showError = sinon.spy();
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestEntity();
          wrapper.vm.showError.should.have.been.calledWith('Unable to parse URL: https://example.org/failure Please make sure the URL conforms to the accepted formats.');
          wrapper.vm.populateFields.should.not.have.been.called;
        });
      });
      context('when the entity can NOT be retrieved', () => {
        it('shows an error for the response', async() => {
          const wrapper = factory();
          sinon.replaceGetter(wrapper.vm.$apis.entity, 'getEntity', () => {
            throw apiError(responseError);
          });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(`http://data.europeana.eu/${type}/base/${id}`));
          wrapper.vm.showError = sinon.spy();
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestEntity();
          wrapper.vm.populateFields.should.not.have.been.called;
          wrapper.vm.showError.should.have.been.calledWith(`Unable to harvest: http://data.europeana.eu/${type}/base/${id} Please make sure the entity can be accessed on the entity API. ${responseError.response.data.error}`);
        });
      });
      context('when the entry fields can NOT be set', () => {
        it('shows an error', async() => {
          const wrapper = factory();
          sinon.replaceGetter(wrapper.vm.$apis.entity, 'getEntity', () => {
            return sinon.fake.returns(entityResponse);
          });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(`http://data.europeana.eu/${type}/base/${id}`));
          sinon.replace(wrapper.vm, 'populateFields', () => {
            throw Error('Contentful error');
          });
          wrapper.vm.showError = sinon.spy();

          await wrapper.vm.harvestEntity();
          wrapper.vm.showError.should.have.been.calledWith('There was a problem updating the entry. Contentful error');
        });
      });
    }),

    describe('getUrlFromUser', () => {
      it('uses the contentfulExtension to get a URL', async() => {
        const wrapper = factory();
        await wrapper.vm.getUrlFromUser();
        wrapper.vm.contentfulExtensionSdk.dialogs.openPrompt.should.have.been.called;
      });
    }),

    describe('entityParamsFromUrl', () => {
      context('when the url is a europeana data URI', () => {
        it('returns the params split from the URI', () => {
          const wrapper = factory();

          wrapper.vm.entityParamsFromUrl(`http://data.europeana.eu/${type}/base/${id}`).should.eql({ type: 'person', id });
        });
      });

      context('when the url is a europeana api URL', () => {
        it('returns the params split from the URI', () => {
          const wrapper = factory();

          wrapper.vm.entityParamsFromUrl(`https://api.europeana.eu/entity/${type}/base/${id}`).should.eql({ type: 'person', id });
        });
      });

      context('when the url is a europeana portal collection page url', () => {
        it('returns the params split from the URI', () => {
          // type: 'agent' is person
          const wrapper = factory();

          wrapper.vm.entityParamsFromUrl(`https://www.europeana.eu/collections/person/${id}-giovnanni-francesco-straparola`).should.eql({ type: 'person', id });
        });
      });

      context('when the url is not a recognized format', () => {
        it('shows an error', () => {
          const wrapper = factory();
          let error;
          try {
            wrapper.vm.entityParamsFromUrl('https://example.org');
          } catch (e) {
            error = e;
          }
          error.name.should.eq('Error');
        });
      });
    });

    describe('showError', () => {
      it('uses a contentful dialog and sets the message to failed', () => {
        const wrapper = factory();
        wrapper.vm.showError('this is the message');
        wrapper.vm.contentfulExtensionSdk.dialogs.openAlert.should.have.been.calledWith({ title: 'Error', message: 'this is the message' });
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
        wrapper.vm.entry.fields.identifier.setValue.should.have.been.calledWith(response.id);
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
    });

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
    it('sets the title to: Entity harvester - Contentful app', () => {
      const wrapper = factory();

      wrapper.vm.head().title.should.eq('Entity harvester - Contentful app');
    });
  });
});
