<template>
  <div class="card">
    <header
      v-if="titles"
      class="card-heading"
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
      class="description"
    >
      <div
        v-for="(value, index) in descriptions.values"
        :key="index"
      >
        <!-- eslint-disable vue/no-v-html -->
        <p
          :lang="descriptions.code"
          v-html="$options.filters.convertNewLine(value)"
        />
        <!-- eslint-disable vue/no-v-html -->
        <hr
          v-if="(index + 1) < descriptions.values.length"
        >
      </div>
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
    }
  };
</script>

<style lang="scss">
  @import './assets/scss/variables.scss';
</style>
