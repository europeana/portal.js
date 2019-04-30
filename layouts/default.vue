<template>
  <div>
    <PageHeader />
    <a
      class="skip-main"
      href="#main"
    >
      Skip to main content
    </a>
    <nuxt />
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
    }
  };

</script>
