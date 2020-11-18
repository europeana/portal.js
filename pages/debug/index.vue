<template>
  <b-container data-qa="debug page">
    <ContentHeader
      :title="title"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-form>
          <b-form-checkbox
            v-model="settings.apiRequests"
            switch
            data-qa="API requests switch"
          >
            {{ $t('debug.apiRequests') }}
          </b-form-checkbox>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentHeader from '../../components/generic/ContentHeader';

  export default {
    components: {
      ContentHeader
    },

    data() {
      return {
        settings: { ...this.$store.getters['debug/settings'] },
        title: this.$t('debug.debug')
      };
    },

    watch: {
      settings: {
        deep: true,
        handler(value) {
          this.$store.commit('debug/updateSettings', value);
        }
      }
    },

    head() {
      return {
        title: this.title + this.$t('pageTitleBranding')
      };
    }
  };
</script>
