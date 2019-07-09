<template>
  <ContentCard
    :title="fields.name"
    :texts="texts"
    :url="destination"
    :image-url="imageUrl"
    :view-more-label-key="moreLabelKey"
  />
</template>

<script>
  import ContentCard from '../generic/ContentCard';
  import { getEntityTypeHumanReadable, getWikimediaThumbnailUrl } from '../../plugins/europeana/entity';
  import { isEuropeanaRecordId } from '../../plugins/europeana/record';

  export default {
    components: {
      ContentCard
    },
    props: {
      fields: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      imageUrl: function () {
        if (this.fields.thumbnailUrl) {
          return this.fields.thumbnailUrl;
        } else if (typeof this.fields.image === 'string') {
          if (this.fields.image.startsWith('http://commons.wikimedia.org/wiki/Special:FilePath/')) {
            return getWikimediaThumbnailUrl(this.fields.image);
          } else {
            return this.fields.image;
          }
        } else if (this.fields.image && this.fields.image.fields) {
          return this.fields.image.fields.file.url;
        } else {
          return '';
        }
      },
      moreLabelKey: function () {
        // TODO: Allow arbitrary value overwrites per card via the CMS.
        return this.forEuropeanaRecord() ? 'goToRecord' : 'readMore';
      },
      destination: function () {
        if (this.fields.url) {
          return this.fields.url;
        } else if (typeof this.fields.identifier === 'string') {
          if (/^https?:\/\//.test(this.fields.identifier)) {
            if (this.fields.identifier.includes('://data.europeana.eu/')) {
              return this.entityRouterLink(this.fields.identifier);
            } else {
              return this.fields.identifier;
            }
          }
          return this.localePath({ name: 'record-all', params: { pathMatch: this.fields.identifier.slice(1) } });
        } else {
          return null;
        }
      },
      texts: function () {
        // TODO: Refactor content model to set this directly, so this method can be skipped.
        let texts = [];
        for (const field of ['description', 'creator', 'provider']) {
          if (this.fields[field]) {
            texts.push(this.fields[field]);
          }
        }
        return texts;
      }
    },
    methods: {
      forEuropeanaRecord: function () {
        return (typeof this.fields.identifier === 'string') && isEuropeanaRecordId(this.fields.identifier);
      },
      entityRouterLink: function (uri) {
        const uriMatch = uri.match('^http://data.europeana.eu/([^/]+)(/base)?/(.+)$');
        return this.localePath({
          name: 'entity-type-all', params: { type: getEntityTypeHumanReadable(uriMatch[1]), pathMatch: uriMatch[3] } }
        );
      }
    }
  };
</script>

<style lang="scss" scoped>

@import "./assets/scss/variables.scss";

.browse-section {
  h2,
  p {
    color: $darkgrey;
    text-align: left;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.12125rem;
  }

  p {
    letter-spacing: 0.0975rem;
    line-height: 1.5;
  }
}

</style>
