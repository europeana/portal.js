<template>
  <div
    data-qa="theme page"
    class="theme-page"
  >
    <ContentHeader
      :title="theme.title"
      :description="theme.description"
      :media-url="shareMediaUrl"
    />
    <RelatedCollections
      :title="theme.relatedTopics.title"
      :entity-uris="theme.relatedTopics.topics"
    />
    <RelatedCollections
      :title="theme.relatedPersons.title"
      :entity-uris="theme.relatedPersons.persons"
      card-variant="mini"
    />
    <CallToActionBanner
      v-if="theme.callToAction"
      :name="theme.callToAction.name"
      :text="theme.callToAction.text"
      :link="theme.callToAction.relatedLink"
      :illustration="theme.callToAction.image"
    />
    <ContentCardSection
      :section="theme.relatedStories"
    />
    <h2>{{ theme.curatedItems.headline }}</h2>
    <ItemPreviewCardGroup
      :items="curatedItems"
      view="grid"
    />
    <SmartLink
      v-if="theme.curatedItems.moreButton"
      :destination="theme.curatedItems.moreButton.url"
      class="btn btn-outline-secondary"
    >
      {{ theme.curatedItems.moreButton.text }}
    </SmartLink>
  </div>
</template>

<script>
  import ContentHeader from '@/components/generic/ContentHeader';
  import RelatedCollections from '@/components/related/RelatedCollections';
  import ContentCardSection from '@/components/browse/ContentCardSection';
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';

  export default {
    name: 'ThemePage',

    components: {
      ContentHeader,
      RelatedCollections,
      CallToActionBanner: () => import('@/components/generic/CallToActionBanner'),
      ContentCardSection,
      ItemPreviewCardGroup,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    async asyncData({ params, query, error, app }) {
      const variables = {
        locale: app.i18n.isoLocale(),
        identifier: params.pathMatch,
        preview: query.mode === 'preview'
      };

      try {
        const response = await app.$contentful.query('themePage', variables);
        const theme = response.data.data.themePage.items[0];

        return { theme };
      } catch (e) {
        error({ statusCode: 500, message: e.toString() });
      }
    },

    computed: {
      // TODO: add pageMeta
      shareMediaUrl() {
        return this.theme?.primaryImageOfPage?.image?.url;
      },
      curatedItems() {
        return this.theme.curatedItems.hasPartCollection.items.map(item => item.encoding);
      }
    },

    mounted() {
      console.log(this.theme);
    }

  };
</script>
