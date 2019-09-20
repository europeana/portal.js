<template>
  <div>
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      {{ $t('layout.skipToMain') }}
    </a>
    <PageHeader />
    <PageNavigation />
    <nuxt
      id="main"
    />
    <PageFooter />
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue';
  import PageNavigation from '../components/PageNavigation.vue';
  import PageFooter from '../components/PageFooter.vue';

  export default {
    components: {
      PageHeader,
      PageNavigation,
      PageFooter
    }
  };
</script>
