<template>
  <b-row>
    <b-col>
      <strong
        class="mb-4 d-inline-block"
      >
        {{ $t('facets.api.name') }}
      </strong>
      <b-form-radio
        v-for="(option, index) in options"
        :key="index"
        v-model="preSelected"
        :value="option"
        name="api"
        @change="emitChange"
      >
        {{ $t(`facets.api.options.${option}`) }}
      </b-form-radio>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'RecordApiToggle',

    props: {
      selected: {
        type: String,
        default: 'fulltext'
      }
    },

    data() {
      return {
        options: ['metadata', 'fulltext'],
        preSelected: this.selected
      };
    },

    watch: {
      selected() {
        this.preSelected = this.selected;
      }
    },

    methods: {
      emitChange() {
        this.$emit('change', this.preSelected);
      }
    }
  };
</script>
