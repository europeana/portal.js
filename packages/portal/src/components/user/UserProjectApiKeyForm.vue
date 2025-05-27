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
        const src = `${ this.$config.app.projectApiKeyFormUrl }/${this.$i18n.locale}?zf_lang=${this.$i18n.locale}&first_name=${ this.loggedInUser.given_name }&last_name=${ this.loggedInUser.family_name }&email=${ this.loggedInUser.email }`;
        return `<iframe src="${ src }" frameborder='0' style='height:2200px;width:100%;' marginwidth='0' marginheight='0' scrolling='auto' allow='geolocation'></iframe>`;
      }
    }
  };
</script>
