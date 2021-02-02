<template>
  <div
    data-qa="static page"
    class="text-page figure-attribution"
  >
    <AuthoredHead
      :title="name"
      :description="description"
      :hero="hero"
    />
    <b-container>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <ShareButton class="mb-4" />
            <SocialShareModal :media-url="hero ? hero.image.url : null" />
            <BrowseSections
              :sections="hasPartCollection.items"
              :rich-text-is-card="false"
              class="authored-section"
              data-qa="browse sections"
            />
          </article>
        </b-col>
      </b-row>
      <b-row
        v-if="relatedLinks"
        class="justify-content-center mt-3"
      >
        <b-col
          cols="12"
          class="mt-3 col-lg-8"
        >
          <LinkList
            :title="relatedLinks.name"
            :items="relatedLinks.links.items"
          />
        </b-col>
      </b-row>
      <b-row class="footer-margin" />
    </b-container>
  </div>
</template>

<script>
  import SocialShareModal from '../sharing/SocialShareModal.vue';
  import ShareButton from '../sharing/ShareButton.vue';
  import BrowseSections from '../browse/BrowseSections';

  export default {
    components: {
      AuthoredHead: () => import('../authored/AuthoredHead'),
      SocialShareModal,
      ShareButton,
      BrowseSections,
      LinkList: () => import('../generic/LinkList')
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
      hasPartCollection: {
        type: Object,
        default: null
      },
      relatedLinks: {
        type: Object,
        default: null
      },
      hero: {
        type: Object,
        default: null
      }
    }
  };
</script>
