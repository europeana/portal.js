import { storiesOf } from '@storybook/vue';
import SearchBarPill from './SearchBarPill.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      delete: 'Delete',
      formatting: {
        ellipsis: '…'
      }
    }
  }
};

storiesOf('Search / Pills', module)
  .add('Default aria label', () => ({
    components: { SearchBarPill },
    i18n,
    data() {
      return {
        text: {
          values: ['This is a pill']
        }
      };
    },
    template: `
      <b-container class="mt-3">
        <SearchBarPill :text="text" :removeLinkTo="{ name: 'test' }"/>
      </b-container>`
  }))
  .add('Custom aria label', () => ({
    components: { SearchBarPill },
    i18n,
    data() {
      return {
        text: {
          values: ['This is a pill']
        }
      };
    },
    template: `
      <b-container class="mt-3">
        <SearchBarPill :text="text" :removeLinkTo="{}" removeLinkLabel="Delete button" />
      </b-container>`
  }))
  .add('Truncated label', () => ({
    components: { SearchBarPill },
    i18n,
    data() {
      return {
        text: {
          values: ['This is a pill truncated truncated']
        }
      };
    },
    template: `
      <b-container class="mt-3">
        <SearchBarPill :text="text" :removeLinkTo="{}"/>
      </b-container>`
  }));
