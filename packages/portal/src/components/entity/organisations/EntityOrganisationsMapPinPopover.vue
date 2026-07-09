<template>
  <b-card
    class="m-1 popover-content"
  >
    <div
      v-if="resizedLogo"
      class="organisation-logo mb-2"
      :style="`background-image: url('${resizedLogo}')`"
    />
    <b-card-title
      v-if="title"
      title-tag="h2"
      :lang="langAttribute(title.code)"
      data-qa="entity title"
    >
      {{ title.values[0] }}
    </b-card-title>
    <b-card-sub-title
      v-if="subTitle"
      :lang="langAttribute(subTitle.code)"
    >
      {{ subTitle.values[0] }}
    </b-card-sub-title>
  </b-card>
</template>

<script>
  import pick from 'lodash/pick';
  import langAttributeMixin from '@/mixins/langAttribute';
  import { langMapValueForLocale } from  '@europeana/i18n';
  import { organizationEntityNativeName, organizationEntityNonNativeEnglishName } from '@/utils/europeana/entities/organizations.js';
  import { getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';

  const FIELDS = [
    'id',
    'logo',
    'note',
    'prefLabel',
    'hasAddress',
    'acronym',
    'type'
  ];

  export default {
    name: 'EntityOrganisationsMapPinPopover',

    mixins: [
      langAttributeMixin
    ],
    props: {
      id: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        entity: null
      };
    },

    computed: {
      title() {
        return langMapValueForLocale(organizationEntityNativeName(this.entity), this.$i18n.locale);
      },
      organisationNonNativeEnglishName() {
        return this.organizationEntityNonNativeEnglishName(this.entity);
      },
      subTitle() {
        return this.organisationNonNativeEnglishName ?
          langMapValueForLocale(this.organisationNonNativeEnglishName, this.$i18n.locale) :
          null;
      },
      resizedLogo() {
        return getWikimediaThumbnailUrl(this.logo, 120);
      }
    },

    watch: {
      async id(newVal) {
        if (newVal) {
          const entity = await this.$apis.entity.get('organisation', this.id.split('/').pop());

          this.entity = pick(entity, FIELDS);
        }
      }
    },

    methods: {
      organizationEntityNativeName,
      organizationEntityNonNativeEnglishName
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

::v-deep .card-body {
  max-width: 20rem;

  .card-title {
    font-size: $font-size-medium;
  }
}
</style>
