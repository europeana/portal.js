<template>
  <div class="card rounded-0 border-0 mb-3 info-panel">
    <header
      v-if="titles.length > 0"
    >
      <template
        v-for="(heading, index) in titles"
      >
        <h1
          v-if="index === 0"
          :key="index"
          :lang="langAttribute(heading.code)"
          class="mb-0"
        >
          {{ heading.value }}
          <MetadataOriginLabel :translation-source="heading.translationSource" />
        </h1>
        <p
          v-else
          :key="index"
          :lang="langAttribute(heading.code)"
          class="font-weight-bold mt-3 mb-0"
        >
          {{ heading.value }}
          <MetadataOriginLabel :translation-source="heading.translationSource" />
        </p>
      </template>
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
        <!-- eslint-disable vue/no-v-html -->
        <p
          v-if="index === 0"
          :lang="langAttribute(description.code)"
          class="description-text-paragraph"
          v-html="convertNewLine(showAll ? value : truncatedDescription)"
        />
        <p
          v-else-if="showAll"
          :lang="langAttribute(description.code)"
          class="description-text-paragraph"
          v-html="convertNewLine(value)"
        />
        <!-- eslint-enable vue/no-v-html -->
        <MetadataOriginLabel
          v-if="index === 0"
          :translation-source="description.translationSource"
        />
        <MetadataOriginLabel
          v-else-if="translatedItemsEnabled && showAll"
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
  import { truncate } from '@europeana/utils';
  import langAttributeMixin from '@/mixins/langAttribute';

  export default {
    name: 'ItemSummaryInfo',

    components: {
      MetadataOriginLabel
    },

    mixins: [
      langAttributeMixin
    ],

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
  @import '@europeana/style/scss/icons';

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
