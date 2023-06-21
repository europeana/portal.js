<template>
  <b-container data-qa="debug page">
    <ContentHeader
      :title="pageMeta.title"
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
            v-if="fieldBoostingFeature"
            :description="$t('debug.settings.form.boosting.description')"
          >
            <b-form-checkbox
              v-model="settings.boosting"
              switch
              data-qa="enable boosting form switch"
            >
              {{ $t('debug.settings.form.boosting.label') }}
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
  import ContentHeader from '@/components/content/ContentHeader';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'DebugIndexPage',

    components: {
      ContentHeader
    },

    mixins: [pageMetaMixin],

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.redirect = from;
      });
    },

    data() {
      return {
        settings: { ...this.$store.getters['debug/settings'] },
        redirect: null
      };
    },

    computed: {
      pageMeta() {
        return {
          title: this.$t('debug.debug')
        };
      },
      fieldBoostingFeature() {
        return this.$features?.fieldBoosting;
      }
    },

    methods: {
      submitForm() {
        this.$store.commit('debug/updateSettings', this.settings);
        this.$router.push(this.redirect || '/');
      }
    }
  };
</script>
