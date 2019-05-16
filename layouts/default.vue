<template>
  <div>
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      Skip to main content
    </a>
    <PageHeader
      :lang-select-enabled="langSelectEnabled"
    />
    <nuxt
      id="main"
    />
    <PageFooter />
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue';
  import PageFooter from '../components/PageFooter.vue';

  export default {
    components: {
      PageHeader,
      PageFooter
    },
    computed: {
      langSelectEnabled() {
        return process.env.ENABLE_LANG_SELECT === 'true';
      }
    }
  };

</script>
