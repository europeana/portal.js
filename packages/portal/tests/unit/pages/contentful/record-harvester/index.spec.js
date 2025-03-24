import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/record-harvester/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const apiResponse = () => ({
  success: true,
  itemsCount: 1,
  totalResults: 1,
  items: [
    {
      dataProvider: ['Rijksmuseum'],
      dcDescription: ['Description EN', 'Description NL'],
      dcDescriptionLangAware: {
        en: ['Description EN'],
        nl: ['Description NL']
      },
      dcTitleLangAware: {
        en: ['The Milkmaid'],
        nl: ['Het melkmeisje']
      },
      edmIsShownAt: ['http://example.org/isShownAt'],
      edmIsShownBy: ['http://example.org/isShownBy'],
      edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json'],
      europeanaCompleteness: 10,
      guid: 'https://www.europeana.eu/item/90402/SK_A_2344?utm_source=api&utm_medium=api&utm_campaign=api2demo',
      id: '/90402/SK_A_2344',
      link: 'https://api.europeana.eu/record/90402/SK_A_2344.json?wskey=api2demo',
      provider: ['Rijksmuseum'],
      rights: ['http://creativecommons.org/publicdomain/mark/1.0/'],
      score: 16.46924,
      title: ['The Milkmaid', 'Het melkmeisje'],
      type: 'IMAGE',
      year: ['1660']
    }
  ]
});

const factory = (data) => shallowMountNuxt(page, {
  localVue,
  data: () => {
    return { ...data };
  },
  mocks: {
    $t: (key) => key,
    $i18n: {
      locale: 'en'
    },
    $apis: {
      record: {
        search: sinon.stub()
      }
    }
  }
});

const automatedRecordCardFields = ['identifier', 'name', 'encoding'];

describe('pages/contentful/record-harvester/index', () => {
  beforeAll(() => {
    window.contentfulExtension = fakeContentfulExtension({ entryFields: automatedRecordCardFields });
  });

  describe('rendered content', () => {
    describe('input', () => {
      it('is a form field that allows a record ID to be input', async() => {
        const wrapper = factory();
        const input = await wrapper.find('b-form-input-stub');
        expect(input.isVisible()).toBe(true);
      });
    });

    describe('buttons', () => {
      it('has a go and clear all data button', async() => {
        const wrapper = factory();

        const buttons = await wrapper.findAll('b-button-stub');
        const goButton = buttons.filter((button) => button.text() === 'Go!');
        const clearButton = buttons.filter((button) => button.text() === 'Clear all data');

        expect(goButton.isVisible()).toBe(true);
        expect(clearButton.isVisible()).toBe(true);
      });
    });

    describe('thumbnail preview', () => {
      it('uses the edmPreview from the encoding data as an image source', async() => {
        const wrapper = factory({ encoding: apiResponse().items[0] });

        const image = await wrapper.find('img');
        expect(image.isVisible()).toBe(true);
        expect(image.attributes('src')).toEqual('https://api.europeana.eu/thumbnail/v2/url.jsonsize=w200');
      });
    });
  });

  describe('head', () => {
    describe('title', () => {
      it('is "Record harvester - Contentful app"', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Record harvester - Contentful app');
      });
    });
  });

  describe('methods', () => {
    describe('harvestRecord', () => {
      describe('when the item can be retrieved', () => {
        it('calls populateFields with the item', async() => {
          const wrapper = factory({ identifier: 'http://data.europeana.eu/item/90402/SK_A_2344' });

          wrapper.vm.$apis.record.search.resolves(apiResponse());

          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestRecord();
          expect(wrapper.vm.populateFields.called).toBe(true);
          expect(wrapper.vm.identifier).toEqual('/90402/SK_A_2344');
          expect(wrapper.vm.encoding).toEqual(apiResponse().items[0]);
          expect(wrapper.vm.message).toEqual('Success');
        });
      });

      describe('when the item URL can not be parsed', () => {
        it('shows a message and does not overwrite fields', async() => {
          const wrapper = factory({ identifier: 'NOT A RECORD IDENTIFIER' });

          wrapper.vm.$apis.record.search.resolves(apiResponse());

          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestRecord();
          expect(wrapper.vm.populateFields.called).toBe(false);
          expect(wrapper.vm.message).toEqual('Unable to parse URL: NOT A RECORD IDENTIFIER Please make sure the URL conforms to the accepted formats.');
        });
      });

      describe('when the item can not be retrieved', () => {
        it('shows a message and does not overwrite fields', async() => {
          const wrapper = factory({ identifier: 'http://data.europeana.eu/item/90402/SK_A_2344' });

          wrapper.vm.$apis.record.search.resolves({ items: [] });

          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestRecord();
          expect(wrapper.vm.populateFields.called).toBe(false);
          expect(wrapper.vm.message).toEqual('Unable to harvest "/90402/SK_A_2344". Please make sure the item can be accessed on the Record API. Error: "Not found"');
        });
      });

      describe('when the entry fields can not be set', () => {
        it('shows message', async() => {
          const wrapper = factory({ identifier: 'http://data.europeana.eu/item/90402/SK_A_2344' });

          wrapper.vm.$apis.record.search.resolves(apiResponse());

          wrapper.vm.populateFields = sinon.stub().throws('contentful', 'Contentful error.');

          await wrapper.vm.harvestRecord();
          expect(wrapper.vm.populateFields.called).toBe(true);
          expect(wrapper.vm.message).toEqual('There was a problem updating the entry. Contentful error.');
        });
      });
    });

    describe('generateName', () => {
      describe('when there is a localisable value', () => {
        it('selects the english value', async() => {
          const wrapper = factory({
            encoding: apiResponse().items[0],
            identifer: undefined
          });
          const result = wrapper.vm.generateName();
          expect(result).toEqual('The Milkmaid');
        });
      });

      describe('when there is NO localisable value', () => {
        it('uses the identifer as a name', async() => {
          const wrapper = factory({ identifier: '/90402/SK_A_2344' });
          const result = wrapper.vm.generateName();
          expect(result).toEqual('Record /90402/SK_A_2344');
        });
      });
    });

    describe('populateFields', () => {
      it('sets the identifier, name and encoding', async() => {
        const wrapper = factory({
          encoding: apiResponse().items[0],
          identifier: '/90402/SK_A_2344'
        });

        wrapper.vm.contentfulExtensionSdk.field.setValue = sinon.spy();
        wrapper.vm.contentfulExtensionSdk.entry.fields.name.setValue = sinon.spy();
        wrapper.vm.contentfulExtensionSdk.entry.fields.encoding.setValue  = sinon.spy();

        await wrapper.vm.populateFields();
        expect(wrapper.vm.contentfulExtensionSdk.field.setValue.calledWith('/90402/SK_A_2344')).toBe(true);
        expect(wrapper.vm.contentfulExtensionSdk.entry.fields.name.setValue.calledWith('The Milkmaid')).toBe(true);
        expect(wrapper.vm.contentfulExtensionSdk.entry.fields.name.setValue.called).toBe(true);
      });
    });

    describe('resetRecord', () => {
      describe('when everything works', () => {
        it('clears all the fields', async() => {
          const wrapper = factory({
            encoding: apiResponse().items[0],
            name: 'The Milkmaid',
            identifier: '/90402/SK_A_2344'
          });

          wrapper.vm.contentfulExtensionSdk.entry.fields.identifier.removeValue = sinon.spy();
          wrapper.vm.contentfulExtensionSdk.entry.fields.name.removeValue = sinon.spy();
          wrapper.vm.contentfulExtensionSdk.entry.fields.encoding.removeValue  = sinon.spy();

          await wrapper.vm.resetRecord();

          expect(wrapper.vm.contentfulExtensionSdk.entry.fields.identifier.removeValue.called).toBe(true);
          expect(wrapper.vm.contentfulExtensionSdk.entry.fields.name.removeValue.called).toBe(true);
          expect(wrapper.vm.contentfulExtensionSdk.entry.fields.encoding.removeValue.called).toBe(true);

          expect(wrapper.vm.identifer).toEqual(undefined);
          expect(wrapper.vm.encoding).toEqual(null);
          expect(wrapper.vm.message).toEqual('Successfully cleared all data');
        });
      });

      describe('when the fields can NOT be cleared', () => {
        it('shows a message', async() => {
          const wrapper = factory({
            encoding: apiResponse().items[0],
            name: 'The Milkmaid',
            identifier: '/90402/SK_A_2344'
          });

          wrapper.vm.contentfulExtensionSdk.entry.fields.identifier.removeValue =  sinon.stub().throws('contentful', 'Contentful error.');

          await wrapper.vm.resetRecord();

          expect(wrapper.vm.message).toEqual('There was a problem clearing the entry. Contentful error.');
        });
      });
    });
  });
});
