<template>
  <div
    data-qa="static page"
    class="text-page"
  >
    <AuthoredHead
      :title="name"
      :description="description"
    />
    <b-container
      class="footer-margin"
    >
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <div class="d-flex flex-wrap align-items-center">
              <ShareButton class="mr-4 mb-4" />
              <ShareSocialModal />
              <StaticAutomatedTranslationLabel
                v-if="automatedTranslation"
                class="mb-4"
              />
            </div>
            <div
              class="authored-section"
              data-qa="authored section"
            >
              <ContentSection
                v-for="(section, index) in (hasPartCollection?.items || [])"
                :key="index"
                :section="section"
                :rich-text-is-card="false"
              />
            </div>
          </article>
        </b-col>
      </b-row>
      <b-row
        v-if="relatedLinks"
        class="justify-content-center"
      >
        <b-col
          cols="12"
          class="mt-3 col-lg-8"
        >
          <LinkList
            :title="relatedLinks?.name"
            :items="relatedLinks?.links?.items"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ShareSocialModal from '../share/ShareSocialModal.vue';
  import ShareButton from '../share/ShareButton.vue';
  import ContentSection from '../content/ContentSection';

  export default {
    components: {
      AuthoredHead: () => import('../authored/AuthoredHead'),
      ContentSection,
      LinkList: () => import('../generic/LinkList'),
      ShareButton,
      ShareSocialModal,
      StaticAutomatedTranslationLabel: () => import('@/components/static/StaticAutomatedTranslationLabel')
    },
    props: {
      name: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      },
      automatedTranslation: {
        type: Boolean,
        default: false
      },
      hasPartCollection: {
        type: Object,
        default: null
      },
      relatedLinks: {
        type: Object,
        default: null
      }
    }
  };
</script>
