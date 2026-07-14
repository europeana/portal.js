<template>
  <b-card
    v-show="entity"
    class="m-sm-1 popover-content"
  >
    <b-button
      variant="dark-flat"
      class="d-sm-none close-button position-absolute"
      :aria-label="$t('actions.close')"
      @click="closePopover"
    >
      <span class="icon-clear" />
    </b-button>
    <TransitionGroup
      name="fade"
    >
      <div
        v-if="resizedLogo"
        key="0"
        class="organisation-logo mb-2"
        :style="`background-image: url('${resizedLogo}')`"
      />
      <SmartLink
        key="1"
        :destination="entityRoute"
      >
        <b-card-title
          v-if="title"
          title-tag="h3"
          class="mb-2"
          :lang="langAttribute(title.code)"
        >
          {{ title.values[0] }}
        </b-card-title>
        <b-card-sub-title
          v-if="subTitle"
          :lang="langAttribute(subTitle.code)"
          sub-title-tag="h4"
        >
          {{ subTitle.values[0] }}
        </b-card-sub-title>
      </SmartLink>
      <b-card-text
        v-if="location"
        key="2"
        text-tag="div"
        class="organisation-location d-flex align-items-center mt-3 mb-2"
        lang="en"
      >
        <span class="icon-location" />
        {{ location }}
      </b-card-text>
    </TransitionGroup>
  </b-card>
</template>

<script>
  import pick from 'lodash/pick';
  import langAttributeMixin from '@/mixins/langAttribute';
  import { langMapValueForLocale } from  '@europeana/i18n';
  import { organizationEntityNativeName, organizationEntityNonNativeEnglishName } from '@/utils/europeana/entities/organizations.js';
  import { getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';
  import { getLabelledSlug } from '@/plugins/europeana/utils.js';
  import SmartLink from '@/components/generic/SmartLink';

  const FIELDS = [
    'id',
    'logo',
    'prefLabel',
    'hasAddress'
  ];

  export default {
    name: 'EntityOrganisationsMapPinPopover',

    components: {
      SmartLink
    },

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

    async fetch() {
      if (this.id) {
        const entity = await this.$apis.entity.get('organisation', this.id.split('/').pop());

        this.entity = pick(entity, FIELDS);
      }
    },

    computed: {
      entityRoute() {
        const slug = this.entity && getLabelledSlug(this.entity?.id, this.entity?.prefLabel?.en);
        return slug && `/collections/organisation/${slug}`;
      },
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
        return this.entity?.logo?.id && getWikimediaThumbnailUrl(this.entity.logo.id, 120);
      },
      location() {
        return this.entity?.hasAddress && `${this.entity.hasAddress.locality}, ${this.entity.hasAddress.countryName}`;
      }
    },

    watch: {
      id() {
        this.entity = null;
        this.$fetch();
      }
    },

    methods: {
      organizationEntityNativeName,
      organizationEntityNonNativeEnglishName,
      closePopover() {
        this.$emit('close');
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
@import '@europeana/style/scss/transitions';

.card {
  border: none;
  box-shadow: $boxshadow;

  @media (max-width: ($bp-small - 1px)) {
    border-bottom: 1px solid $lightgrey;
    padding-right: 0.75rem;
  }
}

::v-deep .card-body {
  max-width: 21.25rem;

  .close-button {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem;
    line-height: 1;

    span {
      font-size: $font-size-base;
      color: $darkgrey;
    }
  }

  .organisation-logo {
    background-color: $white;
  }

  .card-title {
    font-size: $font-size-medium;
    font-weight: 600;
  }

  .card-subtitle {
    font-size: $font-size-extrasmall;
    font-weight: 600;
    text-transform: uppercase;
    margin-top: 0;
  }

  a {
    display: block;
    text-decoration: none;

    &:hover {
      .card-title,
      .card-subtitle {
        color: $blue !important;
      }
    }
  }

  .card-text {
    color: $darkgrey;
    font-size: $font-size-small;
    font-weight: 600;

    [class^='icon-'],
    [class*=' icon-'] {
      font-size: $font-size-large;
      color: $black;
    }
  }
}

.fade-leave-active {
  transition: none;
}
</style>
