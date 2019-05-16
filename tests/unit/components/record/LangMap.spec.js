import { shallowMount } from '@vue/test-utils';
import LangMap from '../../../../components/record/LangMap.vue';

const factory = () => shallowMount(LangMap);

describe('components/record/LangMap', () => {
  const props = {
    value: {
      fra: ['French value 1', 'French value 2'],
      eng: ['English value']
    }
  };

  it('renders a "multi-lingual metadata" list', () => {
    const wrapper = factory();

    wrapper.find('ul[data-qa="multi-lingual metadata"]').isVisible().should.equal(true);
  });

  describe('each value', () => {
    it('is displayed with its language', () => {
      const wrapper = factory();

      wrapper.setProps(props);
      const wrapperText = wrapper.text();

      for (let lang in props.value) {
        for (let value of props.value[lang]) {
          wrapperText.should.match(new RegExp(`${value}\\s+\\(${lang}\\)`));
        }
      }
    });

    it('declares language in `lang` attribute', () => {
      const wrapper = factory();

      wrapper.setProps(props);

      for (let lang in props.value) {
        const langWrappers = wrapper.findAll(`[lang="${lang}"]`);
        for (let value of props.value[lang]) {
          langWrappers.filter(w => w.text() == value).length.should.eq(1);
        }
      }
    });
  });

  it('prioritises English', () => {
    const wrapper = factory();

    wrapper.setProps(props);

    wrapper.findAll('[lang]').at(0).attributes('lang').should.eq('eng');
  });

  it('maps "def" to "und" ISO 639 code', () => {
    const wrapper = factory();

    wrapper.setProps({
      value: {
        def: ['Undefined language value']
      }
    });

    wrapper.findAll('[lang]').at(0).attributes('lang').should.eq('und');
  });
});
