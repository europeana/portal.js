<template>
  <div class="card rounded-0 border-0 mb-3 info-panel">
    <header
      v-if="titles.length > 0"
    >
      <component
        :is="(index === 0) ? 'h1' : 'p'"
        v-for="(heading, index) in titles"
        :key="index"
        :lang="langAttribute(heading.code)"
        class="mb-0"
        :class="{ 'font-weight-bold mt-3': (index > 0) }"
      >
        <ItemDebiasField
          v-if="!!deBias.terms.dcTitle || !!deBias.terms.dctermsAlternative"
          :name="['dcTitle', 'dctermsAlternative']"
          :text="heading.value"
        />
        <template
          v-else
        >
          {{ heading.value }}
        </template>
        <MetadataOriginLabel :translation-source="heading.translationSource" />
      </component>
    </header>
    <div
      v-if="description"
      class="description"
    >
      <div
        v-for="(value, index) in description.values"
        :key="index"
        class="description-text"
      >
        <template
          v-if="index === 0 || showAll"
        >
          <!-- eslint-disable vue/no-v-html -->
          <ItemDebiasField
            v-if="!!deBias.terms.dcDescription"
            :lang="langAttribute(description.code)"
            class="description-text-paragraph"
            name="dcDescription"
            :text="(showAll ? value : truncatedDescription)"
            tag="p"
          >
            <template #default="{ text }">
              <span v-html="convertNewLine(text)" />
            </template>
          </ItemDebiasField>
          <p
            v-else
            :lang="langAttribute(description.code)"
            class="description-text-paragraph"
            v-html="convertNewLine(showAll ? value : truncatedDescription)"
          />
          <!-- eslint-enable vue/no-v-html -->
        </template>
        <MetadataOriginLabel
          v-if="index === 0 || (translatedItemsEnabled && showAll)"
          :translation-source="description.translationSource"
        />
        <hr
          v-if="(index + 1) < description.values.length && showAll"
        >
      </div>
      <b-button
        v-if="expandableDescription"
        data-qa="description show link"
        class="btn-link is-size-4 p-0 mt-2"
        variant="link"
        @click="toggleMoreDescription"
      >
        {{ showAll ? $t('actions.showLess') : $t('actions.readMore') }}
      </b-button>
    </div>
  </div>
</template>

<script>
  import MetadataOriginLabel from '../metadata/MetadataOriginLabel';
  import ItemDebiasField from './ItemDebiasField';
  import langAttributeMixin from '@/mixins/langAttribute';
  import { truncate } from '@europeana/utils';

  export default {
    name: 'ItemSummaryInfo',

    components: {
      ItemDebiasField,
      MetadataOriginLabel
    },

    mixins: [
      langAttributeMixin
    ],

    inject: ['deBias'],

    props: {
      description: {
        type: Object,
        default: null
      },
      titles: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        limitCharacters: 400,
        showAll: false
      };
    },

    computed: {
      expandableDescription() {
        return this.description?.values &&
          (this.description.values.length > 1 || this.description.values[0].length > this.limitCharacters);
      },
      truncatedDescription() {
        if (this.description?.values) {
          return truncate(this.description.values[0], this.limitCharacters);
        }
        return false;
      },
      translatedItemsEnabled() {
        return this.$features.translatedItems;
      }
    },

    methods: {
      /**
       * Convert new lines to <br/>
       * @param {string} val text value
       * @return {string} text value with HTML breaks
       */
      convertNewLine(val) {
        return val.replace(/\n/g, '<br/>');
      },
      toggleMoreDescription() {
        this.showAll = !this.showAll;
      }
    }

  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .description p:last-of-type {
    display: inline;
  }

  .automated,
  .enrichment,
  .original {
    &::after {
      @extend %icon-font;

      font-weight: $font-size-medium;
      opacity: 0.2;
      font-size: 1.125rem;
    }
  }

  .automated::after {
    content: '\e941';
  }

  .enrichment::after {
    content: '\e940';
  }

  .original::after {
    content: '\e93f';
  }

  .translation-source {
    border: none;
    background-color: transparent;
    cursor: default;
    display: inline;
  }
</style>
