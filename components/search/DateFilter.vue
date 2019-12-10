<template>
  <b-row>
    <b-col>
      <b-row>
        <b-col>
          <strong
            class="mb-4 d-inline-block"
          >
            {{ facetName }}
          </strong>
          {{ specificDate }} {{ end }}
          <b-form-checkbox
            class="unstyled mb-2"
            :checked="specificDate"
            @change="setSpecificDate($event)"
          >
            {{ $t('dateFilter.specificDate') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          lg="4"
          class="pr-lg-0"
        >
          <label
            class="sr-only"
            :for="`${name}.start`"
          >
            {{ $t('dateFilter.startDate') }}
          </label>
          <b-input
            :id="`${name}.start`"
            v-model="form.start"
            class="mb-2 mr-sm-2 mb-sm-0"
            type="date"
            data-qa="date range start input"
            :class="{ 'is-active' : form.start }"
            placeholder="dd/mm/yyyy"
            @change="emitDateForm"
          />
        </b-col>

        <b-col
          v-if="!specificDate"
          lg="1"
          class="d-flex align-items-center justify-content-center px-lg-0 py-3 py-lg-0"
        >
          {{ $t('dateFilter.to') }}
        </b-col>

        <b-col
          v-if="!specificDate"
          lg="4"
          class="pl-lg-0"
        >
          <label
            class="sr-only"
            :for="`${name}.end`"
          >
            {{ $t('dateFilter.endDate') }}
          </label>
          <b-input
            :id="`${name}.end`"
            v-model="form.end"
            type="date"
            data-qa="date range end input"
            :class="{ 'is-active' : form.end }"
            placeholder="dd/mm/yyyy"
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
        },
        specificDate: false
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
        if (this.end === null && this.start === null && this.specificDate) {
          this.specificDate = false;
        }
        this.form.end = this.end;
      }
    },

    created() {
      console.log('created');
      if (this.start !== null && this.end !== null && this.start === this.end) {
        this.specificDate = true;
      }
    },

    methods: {
      emitDateForm() {
        console.log('emitDateForm');
        if (this.specificDate) {
          this.form.end = this.form.start;
        }
        this.$emit('dateFilter', this.name, this.form);
      },
      setSpecificDate(checked) {
        console.log('setSpecificDate', checked);
        this.specificDate = checked;

        if (!this.specificDate) {
          this.form.end = '';
        } else {
          this.form.end = this.form.start;
        }

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
