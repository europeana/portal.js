<template>
  <ContentCard
    :title="title"
    :texts="texts"
    :url="destination"
    :image-url="imageUrl"
    :image-content-type="imageContentType"
    :variant="cardVariant"
  />
</template>

<script>
  import { mapGetters } from 'vuex';

  import ContentCard from '../generic/ContentCard';
  import { getEntityTypeHumanReadable } from '../../plugins/europeana/entity';
  import { isEuropeanaRecordId } from '../../plugins/europeana/record';

  export default {
    components: {
      ContentCard
    },
    props: {
      fields: {
        type: Object,
        default: () => {}
      },
      cardType: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapGetters({
        apiConfig: 'apis/config'
      }),
      title() {
        return this.fields.name;
      },
      imageIsContentfulAsset() {
        return this.fields.image && this.fields.image.fields && this.fields.image.fields.file;
      },
      imageUrl() {
        if (this.fields.thumbnailUrl) {
          return this.fields.thumbnailUrl;
        } else if (typeof this.fields.image === 'string') {
          return this.fields.image;
        } else if (this.imageIsContentfulAsset) {
          return this.fields.image.fields.file.url;
        }
        return '';
      },
      imageContentType() {
        return this.imageIsContentfulAsset ? this.fields.image.fields.file.contentType : null;
      },
      destination() {
        if (this.fields.url) {
          return this.fields.url;
        } else if (this.forEuropeanaRecord()) {
          return this.recordRouterLink(this.fields.identifier);
        } else if (typeof this.fields.identifier === 'string' && /^https?:\/\//.test(this.fields.identifier)) {
          if (this.forEuropeanaEntity()) {
            return this.entityRouterLink(this.fields.identifier, this.fields.slug);
          } else {
            return this.fields.identifier;
          }
        }
        return '';
      },
      texts() {
        // TODO: Refactor content model to set this directly, so this method can be skipped.
        let texts = [];
        for (const field of ['description', 'creator', 'provider']) {
          if (this.fields[field]) {
            texts.push(this.fields[field]);
          }
        }
        return texts;
      },
      cardVariant() {
        return this.cardType === 'automatedEntityCard' ? 'entity' : 'default';
      }
    },
    methods: {
      forEuropeanaRecord() {
        return (typeof this.fields.identifier === 'string') && isEuropeanaRecordId(this.fields.identifier);
      },
      forEuropeanaEntity() {
        return (typeof this.fields.identifier === 'string') && this.fields.identifier.includes(this.apiConfig.data.origin);
      },
      entityRouterLink(uri, slug) {
        const uriMatch = uri.match(`^${this.apiConfig.data.origin}/([^/]+)(/base)?/(.+)$`);
        return {
          name: 'collections-type-all', params: { type: getEntityTypeHumanReadable(uriMatch[1]), pathMatch: slug ? slug : uriMatch[3] }
        };
      },
      recordRouterLink(identifier) {
        return {
          name: 'item-all', params: { pathMatch: identifier.slice(1) }
        };
      }
    }
  };
</script>
