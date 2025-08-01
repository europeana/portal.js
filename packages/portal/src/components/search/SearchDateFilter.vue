<template>
  <b-form-group
    :label="facetName"
    class="side-facet"
  >
    <div class="d-inline-block">
      <b-checkbox
        v-model="form.specific"
        class="unstyled mb-2"
        data-qa="specific checkbox"
      >
        <span>{{ $t('dateFilter.specificDate') }}</span>
      </b-checkbox>
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
        placeholder="YYYY-MM-DD"
      />
      <template
        v-if="!form.specific"
      >
        <span
          class="d-block py-1"
        >
          {{ $t('dateFilter.to') }}
        </span>
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
          placeholder="YYYY-MM-DD"
        />
      </template>
    </div>
    <b-button
      variant="primary"
      :disabled="disableApplyButton"
      :data-qa="`${name} apply button`"
      :aria-label="$t('actions.apply')"
      class="apply-button"
      @click.stop="emitDateForm"
    >
      <span class="apply-icon icon-arrow-down" />
    </b-button>
  </b-form-group>
</template>

<script>
  export default {
    name: 'SearchDateFilter',

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
      },

      specific: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        form: {}
      };
    },

    computed: {
      facetName() {
        return this.$t(`facets.${this.name}.name`);
      },
      disableApplyButton() {
        return !(this.form.start || this.form.end);
      }
    },

    watch: {
      start() {
        this.init();
      },
      end() {
        this.init();
      },
      specific() {
        this.init();
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        this.form = {
          start: this.start,
          end: this.end,
          specific: this.specific
        };
      },

      emitDateForm() {
        this.$nextTick(() => {
          this.$emit('dateFilter', this.name, this.form);
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .form-control.is-active {
    border: 1px solid $innovationblue;
    color: $darkblue;
  }

  .apply-button {
    height: 2.5rem;
    vertical-align: bottom;
    margin-left: 0.25rem;
    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        height: calc(1.5 * 2.5rem);
        margin-left: calc(1.5 * 0.25rem);
      }
    }
  }
  .apply-icon {
    transform: rotate(-90deg);
    display: inline-block;
  }

</style>
