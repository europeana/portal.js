<template>
  <ContentCard
    :title="title"
    :texts="texts"
    :url="destination"
    :image-url="imageUrl"
    :image-content-type="imageContentType"
    :image-width="imageWidth"
    :image-height="imageHeight"
    :image-alt="imageAlt"
    :omit-all-uris="true"
    :image-optimisation-options="{ width: 510 }"
    :logo="fields.logo"
    :variant="variant"
  />
</template>

<script>
  import ContentCard from '../content/ContentCard';
  import { isEuropeanaRecordId } from '@/utils/europeana/record.js';
  import { getEntityTypeHumanReadable } from '@/utils/europeana/entity.js';

  export default {
    components: {
      ContentCard
    },
    props: {
      fields: {
        type: Object,
        default: () => ({})
      },
      cardType: {
        type: String,
        default: null
      },
      variant: {
        type: String,
        default: null
      }
    },
    computed: {
      cardFields() {
        return this.cardType === 'AutomatedRecordCard' && this.fields.encoding ? this.fields.encoding : this.fields;
      },
      title() {
        if (this.cardType === 'AutomatedRecordCard' && this.fields.encoding) {
          if (this.cardFields.dcTitleLangAware) {
            return this.cardFields.dcTitleLangAware;
          } else if (this.cardFields.dcDescriptionLangAware) {
            return this.cardFields.dcDescriptionLangAware;
          } else {
            return this.$t('record.record');
          }
        }
        return this.cardFields.name;
      },
      imageIsContentfulAsset() {
        return this.cardFields.image?.url?.includes('://images.ctfassets.net/') || false;
      },
      imageUrl() {
        let imageUrl = '';

        if (typeof this.cardFields.image === 'string') {
          imageUrl = this.cardFields.image;
        } else if (this.cardFields.edmPreview) {
          imageUrl = this.$apis.thumbnail.edmPreview(this.cardFields.edmPreview[0], { size: 400 });
        } else if (this.cardFields.entityImage) {
          imageUrl = this.cardFields.entityImage;
        } else if (this.imageIsContentfulAsset) {
          imageUrl = this.cardFields.image.url;
        }

        return imageUrl;
      },
      imageContentType() {
        return this.imageIsContentfulAsset ? this.cardFields.image.contentType : null;
      },
      imageAlt() {
        return this.imageIsContentfulAsset && this.cardFields.image.description ? this.cardFields.image.description : '';
      },
      imageWidth() {
        return this.imageIsContentfulAsset ? this.cardFields.image.width : null;
      },
      imageHeight() {
        return this.imageIsContentfulAsset ? this.cardFields.image.height : null;
      },
      destination() {
        let destination = '';

        if (this.fields.url) {
          destination = this.fields.url;
        } else if (this.forEuropeanaRecord()) {
          destination = this.recordRouterLink(this.fields.identifier);
        } else if (typeof this.fields.identifier === 'string' && /^https?:\/\//.test(this.fields.identifier)) {
          if (this.forEuropeanaEntity()) {
            destination = this.entityRouterLink(this.fields.identifier, this.fields.slug);
          } else {
            destination = this.fields.identifier;
          }
        }

        return destination;
      },
      texts() {
        // TODO: Refactor content model to set this directly, so this method can be skipped.
        const texts = [];
        let textFields;

        if (this.cardType === 'AutomatedRecordCard') {
          if (this.fields.encoding) {
            textFields = ['dcCreatorLangAware', 'dataProvider'];
          } else {
            textFields = ['creator', 'provider'];
          }
        } else {
          textFields = ['description'];
        }

        for (const field of textFields) {
          if (this.cardFields[field]) {
            texts.push(this.cardFields[field]);
          }
        }
        return texts;
      }
    },
    methods: {
      forEuropeanaRecord() {
        return (typeof this.fields.identifier === 'string') && isEuropeanaRecordId(this.fields.identifier);
      },
      forEuropeanaEntity() {
        return (typeof this.fields.identifier === 'string') && this.fields.identifier.includes(this.$apis.data.constructor.BASE_URL);
      },
      entityRouterLink(uri, slug) {
        const uriMatch = uri.match(`^${this.$apis.data.constructor.BASE_URL}/([^/]+)/(.+)$`);
        return {
          name: 'collections-type-all', params: { type: getEntityTypeHumanReadable(uriMatch[1]), pathMatch: slug || uriMatch[2] }
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
