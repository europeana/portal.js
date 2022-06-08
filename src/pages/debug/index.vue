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
          <b-form-group
            :description="$t('debug.settings.form.enabled.description')"
          >
            <b-form-checkbox
              v-model="settings.enabled"
              switch
              data-qa="enable debug menu switch"
            >
              {{ $t('debug.settings.form.enabled.label') }}
            </b-form-checkbox>
          </b-form-group>

          <b-form-group
            :label="$t('debug.settings.form.apiKey.label')"
            label-for="debug-input-api-key"
            :description="$t('debug.settings.form.apiKey.description')"
          >
            <b-form-input
              id="debug-input-api-key"
              v-model="settings.apiKey"
            />
          </b-form-group>

          <b-button
            type="submit"
            variant="primary"
            data-qa="save debug settings button"
          >
            {{ $t('actions.save') }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentHeader from '@/components/generic/ContentHeader';

  export default {
    name: 'DebugIndexPage',

    components: {
      ContentHeader
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.redirect = from;
      });
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

    methods: {
      submitForm() {
        this.$store.commit('debug/updateSettings', this.settings);
        this.$goto(this.redirect || '/');
      }
    }
  };
</script>
