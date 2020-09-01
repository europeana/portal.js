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
        </h1>
        <p
          v-else
          :key="index"
          :lang="heading.code"
          class="font-weight-bold mt-3 mb-0"
        >
          {{ heading.value }}
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
        type: [Object, Boolean],
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
      }
    },
    methods: {
      toggleMoreDescription() {
        this.showAll = !this.showAll;
      }
    }

  };
</script>
