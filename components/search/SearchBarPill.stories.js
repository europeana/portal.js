import { storiesOf } from '@storybook/vue';
import SearchBarPill from './SearchBarPill.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      delete: 'Delete'
    }
  }
};

storiesOf('Search / Pills', module)
  .add('Default aria label', () => ({
    components: { SearchBarPill },
    i18n,
    template: `
      <b-container class="mt-3">
        <SearchBarPill text="This is a pill" :removeLinkTo="{ name: 'test' }"/>
      </b-container>`
  }))
  .add('Custom aria label', () => ({
    components: { SearchBarPill },
    i18n,
    template: `
      <b-container class="mt-3">
        <SearchBarPill text="This is a pill" :removeLinkTo="{}" removeLinkLabel="Delete button" />
      </b-container>`
  }))
  .add('Truncated label', () => ({
    components: { SearchBarPill },
    i18n,
    template: `
      <b-container class="mt-3">
        <SearchBarPill text="This is a pill truncated truncated" :removeLinkTo="{}"/>
      </b-container>`
  }));
