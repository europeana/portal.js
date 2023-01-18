<template>
  <div
    data-qa="theme page"
    class="theme-page"
  >
    <ContentHeader
      :title="theme.name"
      :description="theme.description"
      :media-url="shareMediaUrl"
    />
    <EntityBadges
      :title="relatedTopics.headline"
      :entity-uris="relatedTopics.hasPart"
    />
    <EntityBadges
      :title="relatedPersons.headline"
      :entity-uris="relatedPersons.hasPart"
      card-variant="mini"
    />
    <CallToActionBanner
      v-if="callToAction"
      :name="callToAction.name"
      :text="callToAction.text"
      :link="callToAction.relatedLink"
      :illustration="callToAction.image"
    />
    <h2>{{ curatedItems.headline }}</h2>
    <ItemPreviewCardGroup
      :items="curatedItemsEncoding"
      view="grid"
    />
    <SmartLink
      v-if="curatedItems.moreButton"
      :destination="curatedItems.moreButton.url"
      class="btn btn-outline-secondary"
    >
      {{ curatedItems.moreButton.text }}
    </SmartLink>
  </div>
</template>

<script>
  import ContentHeader from '@/components/generic/ContentHeader';
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';
  import EntityBadges from '@/components/entity/EntityBadges';

  export default {
    name: 'ThemePage',

    components: {
      ContentHeader,
      CallToActionBanner: () => import('@/components/generic/CallToActionBanner'),
      EntityBadges,
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
      relatedTopics() {
        return this.theme.hasPartCollection.items.filter(section => section['__typename'] === 'TopicGroup')[0];
      },
      relatedPersons() {
        return this.theme.hasPartCollection.items.filter(section => section['__typename'] === 'PersonGroup')[0];
      },
      callToAction() {
        return this.theme.hasPartCollection.items.filter(section => section['__typename'] === 'PrimaryCallToAction')[0];
      },
      curatedItems() {
        return this.theme.hasPartCollection.items.filter(section => section['__typename'] === 'CardGroup')[0];
      },
      curatedItemsEncoding() {
        return this.curatedItems.hasPartCollection.items.map(items => items.encoding);
      }
    }

  };
</script>
