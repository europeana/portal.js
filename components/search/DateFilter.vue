<template>
  <b-row>
    <b-col>
      <b-row>
        <b-col>
          <legend class="mb-4 d-inline-block">
            {{ facetName }}
          </legend>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          lg="4"
          class="pr-lg-0"
        >
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
            :class="{ 'is-active' : form.start }"
            @change="emitDateForm"
          />
        </b-col>

        <b-col
          lg="1"
          class="d-flex align-items-center justify-content-center px-lg-0 py-3 py-lg-0"
        >
          {{ $t('dateFilter.to') }}
        </b-col>

        <b-col
          lg="4"
          class="pl-lg-0"
        >
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
            :class="{ 'is-active' : form.end }"
            @change="emitDateForm"
          />
        </b-col>
      </b-row>
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

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .form-control.is-active {
    border: 1px solid $innovationblue;
    color: $innovationblue;
  }
</style>
