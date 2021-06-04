import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '../../../../../src/pages/contentful/entity-harvester/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const contentfulExtensionStub = sinon.stub(window.contentfulExtension, 'init');
const contentfylExtensionSDKStub = sinon.stub();
const contentfylEntryStub = sinon.stub();

//   dialogs: () => {
//     openPrompt: () => {
//       return userURL || 'UserURL';
//     };
//   };
// };

const factory = ({ userURL }) => shallowMountNuxt(page, {
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
    window: () => {
      contentfulExtension: contentfulExtensionStub;
    }
  }
});

describe('Exhibition landing page', () => {
  describe('mounting', () => {
    it('sets the SDK and entry', async() => {
      const wrapper = factory();
      const extensionSdk = wrapper.vm.contentfulExtensionSdk;
      const entry = wrapper.vm.entry;

      extensionSdk.should.eq(contentfulExpansionStub);
      entry.should.eql(expectedEntry);
    });
  });

  describe('methods'), () => {
    const type = 'agent';
    const id = '20';

    describe('harvestEntity', () => {
      context('when the entity can be retrieved', () => {
        $apis.entity.getEntity = mock(response => { entity: true });
        it('calls populateFields for the entity', () => {
          const wrapper = factory({ userURL: `http://data.europeana.eu/${type}/base/${id}` });

          wrapper.vm.harvestEntity();
          wrapper.vm.populateFields.should.have.been.called;
        });
      });
      context('when the entity can NOT be retrieved', () => {
        $apis.entity.getEntity = mock(response => { error: 'there was an error' });
        it('shows an error for the URL', () => {
          const wrapper = factory({ userURL: `http://data.europeana.eu/${type}/base/${id}` });

          wrapper.vm.harvestEntity();
          wrapper.vm.populateFields.should.not.have.been.called;
        });
      });
    }),

    describe('entityPatamsFromUrl', () => {
      context('when the url is a europeana data URI', () => {
        it('returns the params split from the URI', () => {
          const wrapper = factory();

          wrapper.vm.entityPatamsFromUrl(`http://data.europeana.eu/${type}/base/${id}`).should.eq({ type, id });
        });
      });

      context('when the url is a europeana api URL', () => {
        it('returns the params split from the URI', () => {
          const wrapper = factory();

          wrapper.vm.entityPatamsFromUrl(`https://api.europeana.eu/entity/${type}/base/${id}`).should.eq({ type, id });
        });
      });

      context('when the url is a europeana portal collection page url', () => {
        it('returns the params split from the URI', () => {
          // type: 'agent' is person
          const wrapper = factory();

          wrapper.vm.entityPatamsFromUrl(`https://www.europeana.eu/collections/person/${id}-giovnanni-francesco-straparola`).should.eq({ type, id });
        });
      });

      context('when the url is not a recognized format', () => {
        it('shows an error', () => {
          const wrapper = factory();
          wrapper.vm.entityPatamsFromUrl('https://example.org').should.raiseError;
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
  },

  describe('head()', () => {
    it('is Entity harvester - Contentful app', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      headMeta.find(meta => meta.property === 'title').content.should.eq('Entity harvester - Contentful app');
    });
  });
});
