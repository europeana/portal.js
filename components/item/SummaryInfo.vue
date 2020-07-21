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
      v-if="description"
      class="description px-4"
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
          return this.description.values.length > 1 || this.description.values[0].length >= this.limitCharacters;
        }
        return false;
      },
      truncatedDescription() {
        return this.$options.filters.truncate(this.description.values[0], this.limitCharacters, this.$t('formatting.ellipsis'));
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
