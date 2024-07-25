<template>
  <div v-if="feedbackEnabled">
    <client-only>
      <div
        id="europeana-feedback-widget"
        data-api-url="/_api/jira-service-desk/feedback"
        :data-faq-url="faqUrl"
        :data-locale="$i18n.locale"
        data-qa="feedback widget"
      />
      <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@europeana/feedback-widget@0.3.0-rc.2/dist/europeana-feedback-widget.js"
        integrity="sha384-u9uk9KOvOrG5X4yAGn1xMj1P5YmrJWanSqij7tvI4eZTjI/UQGK98lq3e/I6XfuP"
      >
        <!-- prevent eslint closing this -->
      </script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@europeana/feedback-widget@0.3.0-rc.2/dist/europeana-feedback-widget.css"
      >
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  export default {
    name: 'FeedbackWidget',

    components: {
      ClientOnly
    },

    props: {
      faqUrl: {
        type: String,
        default: '/faq'
      }
    },

    data() {
      return {
        feedbackEnabled: this.$features?.jiraServiceDeskFeedbackForm && !!this.$config?.app?.baseUrl
      };
    }
  };
</script>
