<template>
  <b-form inline>
    <legend>
      {{ name }}
    </legend>
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
    />

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
    />
  </b-form>
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
          name: this.name,
          start: this.start,
          end: this.end
        }
      };
    },

    watch: {
      form: {
        deep: true,
        handler() {
          console.log('form', this.form);
          this.$emit('dateFilter', this.form);
        }
      }
    },

    mounted() {
      console.log('form');
    }
  };
</script>
