<template>
  <section
    v-if="section"
    class="browse-section mb-5"
    data-qa="browse section"
  >
    <b-container>
      <!-- This could be h2 instead of component, as it's static for now -->
      <component
        :is="'h2'"
        class="card-group-title"
        data-qa="section headline"
      >
        {{ section.name }}
      </component>
    </b-container>
    <!-- For now we only have the Organisation map usecase -->
    <client-only>
      <EntityOrganisationsMap class="mb-4" />
    </client-only>
    <b-container>
      <SmartLink
        v-if="section.moreButton"
        :destination="section.moreButton.url"
        class="btn btn-outline-secondary"
        data-qa="section more button"
      >
        {{ section.moreButton.text }}
      </SmartLink>
    </b-container>
  </section>
</template>

<script>
  import parallaxElement from '@/utils/parallaxElement.js';

  export default {
    name: 'MapSection',

    components: {
      EntityOrganisationsMap: () => import('@/components/entity/organisations/EntityOrganisationsMap'),
      SmartLink: () => import('./SmartLink.vue')
    },

    props: {
      section: {
        type: Object,
        required: true
      }
    },

    mounted() {
      window.addEventListener('scroll', this.parallaxMap);
    },

    beforeDestroy() {
      window.removeEventListener('scroll', this.parallaxMap);
    },

    methods: {
      parallaxMap() {
        parallaxElement('#europeana-map');
      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .embed-map {
    overflow: hidden;
  }
</style>
