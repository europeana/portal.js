<template>
  <b-container data-qa="debug page">
    <ContentHeader
      :title="title"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-form
          @submit.stop.prevent="submitForm"
        >
          <b-form-checkbox
            v-model="settings.apiRequests"
            switch
            data-qa="API requests switch"
          >
            {{ $t('debug.apiRequests') }}
          </b-form-checkbox>

          <b-form-group
            label="API key"
            label-for="debug-input-api-key"
          >
            <b-form-input
              v-model="settings.apiKey"
              id="debug-input-api-key"
            />
          </b-form-group>

          <b-button
            type="submit"
            variant="primary"
          >
            Save
          </b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentHeader from '../../components/generic/ContentHeader';

  export default {
    name: 'DebugIndexPage',

    components: {
      ContentHeader
    },

    data() {
      return {
        settings: { ...this.$store.getters['debug/settings'] },
        title: this.$t('debug.debug'),
        redirect: null
      };
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.title)
      };
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.redirect = from;
      });
    },

    methods: {
      submitForm() {
        this.$store.commit('debug/updateSettings', this.settings);
        this.$goto(this.redirect);
      }
    }
  };
</script>
