<template>
  <div class="card mb-3 ">
    <header
      v-if="titles"
      class="card-heading px-4 pt-4"
    >
      <template
        v-for="(heading, index) in titles"
      >
        <h1
          v-if="index === 0"
          :key="index"
          :lang="heading.code"
        >
          {{ heading.value }}
        </h1>
        <p
          v-else
          :key="index"
          :lang="heading.code"
          class="font-weight-bold"
        >
          {{ heading.value }}
        </p>
      </template>
    </header>
    <div
      v-if="descriptions"
      class="description px-4"
    >
      <div
        v-for="(value, index) in descriptions.values"
        :key="index"
      >
        <!-- eslint-disable vue/no-v-html -->
        <p
          :lang="descriptions.code"
          v-if="index === 0"
          v-html="$options.filters.convertNewLine(showAll ? value : truncatedDescription)"
        />
        <p
          :lang="descriptions.code"
          v-else-if="showAll"
          v-html="$options.filters.convertNewLine(value)"
        />
        <!-- eslint-disable vue/no-v-html -->
        <hr
          v-if="(index + 1) < descriptions.values.length && showAll"
        >
      </div>
      <b-button
        v-if="expandableDescription"
        data-qa="description show link"
        class="btn-link is-size-4 p-0 mb-4"
        variant="link"
        @click="toggleMoreDescription"
      >
        {{ showAll ? $t('readLess') : $t('readMore') }}
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
      descriptions: {
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
        return this.descriptions && this.descriptions.values.join().length >= this.limitCharacters
      },
      truncatedDescription() {
        return this.$options.filters.truncate(this.descriptions.values[0], this.limitCharacters, this.$t('formatting.ellipsis'));
      }
    },
    methods: {
      toggleMoreDescription() {
        this.showAll = !this.showAll;
      }
    }

  };
</script>

<style lang="scss">
  @import './assets/scss/variables.scss';

  .btn-link {
    color: $innovationblue;
    text-decoration: underline;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: 600;

    &:hover {
      text-decoration: none;
    }
  }

</style>
