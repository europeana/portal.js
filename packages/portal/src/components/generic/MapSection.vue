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
      <EntityOrganisationsMap
        :hash="true"
        :map-element-id="mapElementId"
        class="mb-4"
      />
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
  import { computed } from 'vue';
  import kebabCase from 'lodash/kebabCase';

  import { useParallaxElement } from '@/composables/parallaxElement.js';

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

    setup(props) {
      const mapElementId = computed(() => {
        return `${kebabCase(props.section.name)}-europeana-map`;
      });

      useParallaxElement(`#${mapElementId.value}`);

      return { mapElementId };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep .europeana-map-container .europeana-map {
    scroll-margin-top: 7rem;

    @media (min-width: $bp-4k) {
      scroll-margin-top: 10.5rem;
    }
  }

  ::v-deep .embed-map {
    overflow: hidden;
    position: relative;
    box-shadow: $boxshadow-small;
  }
</style>
