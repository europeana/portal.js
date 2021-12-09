<template>
  <b-form-group
    :label="facetName"
  >
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <b-checkbox
              v-model="form.specific"
              class="unstyled mb-2"
              @change="emitDateForm"
            >
              {{ $t('dateFilter.specificDate') }}
            </b-checkbox>
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
              placeholder="YYYY-MM-DD"
              @input="emitDateForm"
            />
          </b-col>

          <template
            v-if="!form.specific"
          >
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
                @input="emitDateForm"
              />
            </b-col>
          </template>
        </b-row>
      </b-col>
    </b-row>
  </b-form-group>
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

        this.$store.dispatch('search/setResettableFilter', {
          name: this.name,
          selected: this.start || this.end
        });
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
  @import '@/assets/scss/variables';

  .form-control.is-active {
    border: 1px solid $innovationblue;
    color: $innovationblue;
  }
</style>
