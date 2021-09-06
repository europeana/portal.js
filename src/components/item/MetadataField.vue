<template>
  <div
    v-if="hasValuesForLocale"
    :data-field-name="name"
    data-qa="metadata field"
    class="metadata-row d-lg-flex"
  >
    <label
      v-if="labelled"
      data-qa="label"
      class="m-0"
    >
      {{ $t(`fieldLabels.${context}.${name}`) }}
    </label>
    <ul
      class="m-0 p-0 text-left text-lg-right list-unstyled"
    >
      <template
        v-for="(value, index) of displayValues"
      >
        <template
          v-if="value.id"
        >
          <li
            :lang="value.lang"
            :data-qa="fieldData.url ? 'entity link' : 'entity value'"
          >
            <SmartLink
              v-if="fieldData.url"
              :destination="fieldData.url"
              :link-class="name === 'edmDataProvider' ? 'view-at' : null"
              @click.native="name === 'edmDataProvider' && $matomo && $matomo.trackEvent('Item_external link', 'Click Provider Link', fieldData.url);"
            >
              {{ value.value }}
            </SmartLink>
            <EntityField
              v-else
              :value="value.value"
              :about="value.id"
            />
          </li>
        </template>
        <li
          v-else
          :lang="value.lang"
          data-qa="literal value"
        >
          <SmartLink
            v-if="fieldData.url"
            :destination="fieldData.url"
            :link-class="name === 'edmDataProvider' ? 'view-at' : null"
            @click.native="name === 'edmDataProvider' && $matomo && $matomo.trackEvent('Item_external link', 'Click Provider Link', fieldData.url);"
          >
            {{ value.value }}
          </SmartLink>
          <template
            v-else
          >
            {{ value.value }}
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  import { localiseLangMap } from  '@/plugins/europeana/utils';
  import EntityField from './EntityField';
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'MetadataField',

    components: {
      EntityField,
      SmartLink
    },

    props: {
      name: {
        type: String,
        default: ''
      },
      fieldData: {
        type: [String, Object, Array],
        default: null
      },
      context: {
        type: String,
        default: 'default'
      },
      labelled: {
        type: Boolean,
        default: true
      },
      limit: {
        type: Number,
        default: -1
      },
      omitAllUris: {
        type: Boolean,
        default: false
      },
      omitUrisIfOtherValues: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      displayValues() {
        let display = [].concat(this.langMappedValues);

        if (this.limitDisplayValues && (this.langMappedValues.length > this.limit)) {
          display = display.slice(0, this.limit).concat(this.$t('formatting.ellipsis'));
        }

        return display;
      },

      limitDisplayValues() {
        return (this.limit > -1);
      },

      langMappedValues() {
        let values;

        if (this.fieldData === null) {
          values = null;
        } else if (typeof (this.fieldData) === 'string') {
          values = [
            { value: this.fieldData, code: '' }
          ];
        } else if (Array.isArray(this.fieldData)) {
          values = this.fieldData.map(datum => (
            { value: datum, code: '' }
          ));
        } else if (Object.prototype.hasOwnProperty.call(this.fieldData, 'url')) {
          values = localiseLangMap(this.fieldData.value, this.$i18n.locale);
        } else {
          values = localiseLangMap(this.fieldData, this.$i18n.locale, { omitUrisIfOtherValues: this.omitUrisIfOtherValues, omitAllUris: this.omitAllUris });
        }

        return values;
      },

      hasValuesForLocale() {
        return (this.langMappedValues?.length || 0) >= 1;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';
  @import '@/assets/scss/icons.scss';

  .metadata-row {
    border-bottom: 1px solid #e7e7e9;
    font-size: $font-size-small;
    padding: 1rem 0;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      border: 0;
      padding-bottom: 0;
    }

    ul {
      font-weight: 600;

      li {
        display: inline;
        &:not(:last-child):after {
          content: ';';
          padding: 0 0.2rem;
        }
        a.is-external-link:after {
          content: '\e900';
          @extend .icon-font;
          vertical-align: initial;
          font-size: 0.75rem;
        }
      }
    }

    @media (min-width: $bp-large) {
      label,
      ul {
        flex: 1;
      }
    }
  }
</style>
