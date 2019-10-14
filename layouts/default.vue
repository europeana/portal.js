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
    <b-breadcrumb
      :items="breadcrumbs"
      class="px-0"
    />
    <PageNavigation />
    <nuxt
      id="main"
    />
    <PageFooter />
  </div>
</template>

<script>
  import { BBreadcrumb } from 'bootstrap-vue';
  import PageHeader from '../components/PageHeader.vue';
  import PageNavigation from '../components/PageNavigation.vue';
  import PageFooter from '../components/PageFooter.vue';

  export default {
    components: {
      BBreadcrumb,
      PageHeader,
      PageNavigation,
      PageFooter
    }
  };
</script>
