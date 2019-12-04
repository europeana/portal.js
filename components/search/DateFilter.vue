<template>
  <b-row>
    <b-col cols="12">
      <legend>
        {{ facetName }}
      </legend>
    </b-col>
    <b-col>
      <label
        class="sr-only"
        for="start-date"
      >
        {{ $t('dateFilter.startDate') }}
      </label>
      <b-input
        id="start-date"
        v-model="form.start"
        class="mb-2 mr-sm-2 mb-sm-0"
        type="date"
        data-qa="start input"
        @change="emitDateForm"
      />
    </b-col>

    <b-col>
      <label
        class="sr-only"
        for="end-date"
      >
        {{ $t('dateFilter.endDate') }}
      </label>
      <b-input
        id="end-date"
        v-model="form.end"
        type="date"
        data-qa="end input"
        @change="emitDateForm"
      />
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'DateFilter',

    props: {
      name: {
        type: String,
        required: true
      },

      start: {
        type: String,
        default: ''
      },

      end: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        form: {
          start: this.start,
          end: this.end
        }
      };
    },

    computed: {
      facetName() {
        return this.$t(`facets.${this.name}.name`);
      }
    },

    watch: {
      start() {
        this.form.start = this.start;
      },
      end() {
        this.form.end = this.end;
      }
    },

    methods: {
      emitDateForm() {
        this.$emit('dateFilter', this.name, this.form);
      }
    }
  };
</script>
