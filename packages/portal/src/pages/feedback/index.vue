<template>
  <FeedbackWidget />
</template>

<script>
  import FeedbackWidget from '@/components/feedback/FeedbackWidget';
  import versions from '../../../pkg-versions';

  export default {
    name: 'FeedbackIndexPage',

    layout: 'minimal',

    components: {
      FeedbackWidget
    },

    head() {
      return {
        link: [
          { rel: 'icon', href: require('@europeana/style/img/favicon.ico').default, type: 'image/x-icon' },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ]
      };
    }
  };
</script>
