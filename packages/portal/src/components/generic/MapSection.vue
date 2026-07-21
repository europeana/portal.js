<template>
  <section
    v-if="section"
    class="browse-section row mb-5"
    data-qa="browse section"
  >
    <div class="col-12 col-lg-6">
      <!-- This could be h2 instead of component, as it's static for now -->
      <component
        :is="'h2'"
        class="card-group-title"
        data-qa="section headline"
      >
        {{ section.name }}
      </component>
    </div>
    <div class="col-12">
      <!-- For now we only have the Organisation map usecase -->
      <client-only>
        <EntityOrganisationsMap />
      </client-only>
      <SmartLink
        v-if="section.moreButton"
        :destination="section.moreButton.url"
        class="btn btn-outline-secondary"
        data-qa="section more button"
      >
        {{ section.moreButton.text }}
      </SmartLink>
    </div>
  </section>
</template>

<script>
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
    }
  };
</script>
