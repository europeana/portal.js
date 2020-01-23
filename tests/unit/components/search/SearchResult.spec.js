import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchResult from '../../../../components/search/SearchResult.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(SearchResult, {
  localVue,
  propsData,
  stubs: ['b-media', 'b-media-body', 'b-media-aside', 'b-img-lazy'],
  mocks: {
    $i18n: {
      locale: 'en'
    },
    $t: (key) => key
  }
});

describe('components/search/SearchResult', () => {
  const requiredProps = {
    edmPreview: 'https://www.example.org/thumbnail.jpg',
    edmDataProvider: ['Data Provider']
  };

  it('displays edmPreview thumbnail image', () => {
    const wrapper = factory(requiredProps);

    const image =  wrapper.find('[data-qa="result thumbnail"]');

    image.attributes().src.should.eq(requiredProps.edmPreview);
  });

  it('displays edmDataProvider', () => {
    const wrapper = factory(requiredProps);

    const element = wrapper.find('[data-field-name="edmDataProvider"]');

    element.text().should.eq(requiredProps.edmDataProvider[0]);
  });

  it('displays dcCreator', () => {
    const props = Object.assign({
      dcCreator: { def: ['Anna', 'Bob'] }
    }, requiredProps);
    const wrapper = factory(props);

    const dcCreator = wrapper.find('[name="dcCreator"]');

    dcCreator.props('fieldData').should.deep.eql(props.dcCreator);
  });

  context('when dcTitle is present', () => {
    const props = Object.assign({
      dcTitle: { def: ['Title'] },
      dcDescription: { def: ['Description'] }
    }, requiredProps);

    it('displays dcTitle', () => {
      const wrapper = factory(props);

      const title = wrapper.find('[data-field-name="dcTitle"]');

      title.text().should.eq(props.dcTitle.def[0]);
    });

    it('ignores dcDescription', () => {
      const wrapper = factory(props);

      const description = wrapper.find('[data-field-name="dcDescription"]');

      description.exists().should.be.false;
    });
  });

  context('when dcTitle is absent', () => {
    const props = Object.assign({
      dcDescription: { def: ['Description'] }
    }, requiredProps);

    it('displays dcDescription', () => {
      const wrapper = factory(props);

      const title = wrapper.find('[data-field-name="dcDescription"]');

      title.text().should.eq(props.dcDescription.def[0]);
    });
  });
});
