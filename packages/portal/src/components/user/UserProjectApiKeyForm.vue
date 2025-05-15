<template>
  <EmbedHTML
    v-if="$config.app.projectApiKeyFormUrl"
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
        embed: `<iframe src="${ this.$config.app.projectApiKeyFormUrl }" frameborder='0' style='height:2200px;width:100%;' marginwidth='0' marginheight='0' scrolling='auto' allow='geolocation'></iframe>`
      };
    }
  };
</script>
