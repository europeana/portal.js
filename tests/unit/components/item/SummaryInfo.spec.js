import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SummaryInfo from '@/components/item/SummaryInfo.vue';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();
localVue.filter('truncate', (val) => {
  return val.length > 20 ? val.substring(0, 20) + '...' : val;
});
localVue.filter('convertNewLine', (val) => {
  return val.replace('/n', '<br/>');
});
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      formatting: {
        ellipsis: '…'
      }
    }
  }
});

const factory = (propsData) => mount(SummaryInfo, {
  localVue,
  propsData,
  i18n,
  mocks: {
    $t: (key) => `TRANSLATED: ${key}`,
    $route: {}
  }
});

describe('components/item/SummaryInfo', () => {
  describe('displaying summary info', () => {
    const wrapper = factory({
      titles: [
        { code: 'en', value: 'The title' },
        { code: 'en', value: 'The sub-title' }
      ],
      description: { code: 'en', values: ['The description'] }
    });

    it('shows a title', () => {
      const title = wrapper.find('h1');
      title.attributes().lang.should.eq('en');
      title.text().should.eq('The title');
    });
    it('shows a sub-title', () => {
      const subTitle = wrapper.find('header p');
      subTitle.attributes().lang.should.eq('en');
      subTitle.text().should.eq('The sub-title');
    });
    it('shows a description', () => {
      const description = wrapper.find('div.description p');
      description.attributes().lang.should.eq('en');
      description.text().should.eq('The description');
    });
  });

  describe('when there are multiple descriptions', () => {
    const wrapper = factory({
      titles: [{ code: 'en', value: 'The title' }],
      description: {
        code: 'en',
        values: ['The description', 'another description']
      }
    });

    it('shows a read more button', () => {
      const readMoreToggle = wrapper.find('button');
      readMoreToggle.text().should.eq('TRANSLATED: readMore');
    });
  });

  describe('when there is a long description', () => {
    const wrapper = factory({
      titles: [{ code: 'en', value: 'The title' }],
      description: {
        code: 'en',
        values: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.']
      }
    });

    it('shows a title', () => {
      const readMoreToggle = wrapper.find('button');
      readMoreToggle.text().should.eq('TRANSLATED: readMore');
    });
  });
});
