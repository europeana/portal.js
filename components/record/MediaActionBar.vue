<template>
  <section
    data-qa="action bar"
  >
    <b-button
      :href="url | proxyMedia(europeanaIdentifier)"
      variant="primary"
      data-qa="download button"
    >
      {{ $t('actions.download') }}
    </b-button>
  </section>
</template>

<script>
  export default {
    name: 'MediaActionBar',

    props: {
      url: {
        type: String,
        required: true
      },
      europeanaIdentifier: {
        type: String,
        required: true
      }
    }
  };
</script>
