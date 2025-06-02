<template>
  <EmbedHTML
    v-if="$config.app.projectApiKeyFormUrl && loggedInUser"
    :html="embed"
    class="mb-5"
  />
</template>

<script>
  export default {
    name: 'UserProjectApiKeyForm',

    components: {
      EmbedHTML: () => import('../embed/EmbedHTML')
    },

    data() {
      return {
        loggedInUser: this.$store?.state?.auth?.user
      };
    },

    computed: {
      embed() {
        const params = new URLSearchParams({
          'first_name': this.loggedInUser?.given_name || '',
          'last_name': this.loggedInUser?.family_name || '',
          'email': this.loggedInUser?.email
        }).toString();
        const src = `${ this.$config.app.projectApiKeyFormUrl }/${ this.$i18n.locale }?${ params }`;
        return `<iframe src="${ src }" title="${this.$t('apiKeys.sections.projectKeys.heading')}" frameborder='0' style='height:1600px;width:100%;' marginwidth='0' marginheight='0' scrolling='auto' allow='geolocation'></iframe>`;
      }
    }
  };
</script>
