<template>
  <div class="card rounded-0 border-0 p-4 info-panel">
    <header
      v-if="titles.length > 0"
    >
      <template
        v-for="(heading, index) in titles"
      >
        <h1
          v-if="index === 0"
          :key="index"
          :lang="heading.code"
          class="mb-0"
        >
          {{ heading.value }}
          <button
            v-if="translatedItemsEnabled"
            v-b-tooltip.bottomright="{ customClass: 'tooltip' }"
            :title="$t(`multilingual.${heading.translationSource || 'original'}`)"
            class="translation-source"
            :class="heading.translationSource || 'original'"
          />
        </h1>
        <p
          v-else
          :key="index"
          :lang="heading.code"
          class="font-weight-bold mt-3 mb-0"
        >
          {{ heading.value }}
          <button
            v-if="translatedItemsEnabled"
            v-b-tooltip.bottomright="{ customClass: 'tooltip' }"
            :title="$t(`multilingual.${heading.translationSource || 'original'}`)"
            class="translation-source"
            :class="heading.translationSource || 'original'"
          />
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
      >
        <!-- eslint-disable vue/no-v-html -->
        <p
          v-if="index === 0"
          :lang="description.code"
          v-html="$options.filters.convertNewLine(showAll ? value : truncatedDescription)"
        />
        <p
          v-else-if="showAll"
          :lang="description.code"
          v-html="$options.filters.convertNewLine(value)"
        />
        <!-- eslint-disable vue/no-v-html -->
        <button
          v-if="translatedItemsEnabled && index === 0"
          v-b-tooltip.bottomright="{ customClass: 'tooltip' }"
          :title="$t(`multilingual.${description.translationSource || 'original'}`)"
          class="translation-source"
          :class="description.translationSource || 'original'"
        />
        <button
          v-else-if="translatedItemsEnabled && showAll"
          v-b-tooltip.bottomright="{ customClass: 'tooltip' }"
          :title="$t(`multilingual.${description.translationSource || 'original'}`)"
          class="translation-source"
          :class="description.translationSource || 'original'"
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
        {{ showAll ? $t('showLess') : $t('readMore') }}
      </b-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SummaryInfo',

    components: {
    },

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
        if (this.description && this.description.values) {
          return this.description.values.length > 1 || this.description.values[0].length > this.limitCharacters;
        }
        return false;
      },
      truncatedDescription() {
        if (this.description !== {} && this.description.values) {
          return this.$options.filters.truncate(this.description.values[0], this.limitCharacters, this.$t('formatting.ellipsis'));
        }
        return false;
      },
      translatedItemsEnabled() {
        return this.$config.app.features.translatedItems;
      }
    },
    methods: {
      toggleMoreDescription() {
        this.showAll = !this.showAll;
      }
    }

  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/icons.scss';

.description p:last-of-type {
  display: inline;
}
.automated, .enrichment, .original {
  &:after {
    @extend .icon-font;
    content: '\e91f';
    font-weight: $font-size-medium;
    opacity: 0.2;
  }
}
.translation-source {
  border: none;
  background-color: transparent;
  cursor: default;
  display: inline;
}
</style>
