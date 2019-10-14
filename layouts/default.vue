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
    <b-container>
      <b-row>
        <b-col class="col-12">
          <b-breadcrumb
            :items="breadcrumbs"
            class="px-0"
          />
        </b-col>
      </b-row>
    </b-container>
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
    },

    computed: {
      breadcrumbs() {
        console.log('POO');
        console.log('POO', this.$store.state.breadcrumb);
        return this.$store.state.breadcrumb.data;
      }
    }
  };
</script>
