<template>
  <div
    v-if="hasValuesForLocale"
    :data-field-name="name"
    data-qa="metadata field"
    class="metadata-row d-lg-flex"
  >
    <span
      v-if="location"
      class="pr-1"
    >
      {{ $t('record.locationData') }}
    </span>
    <label
      v-else-if="labelled"
      data-qa="label"
      class="m-0"
    >
      {{ $t(`fieldLabels.${context}.${name}`) }}
    </label>
    <ul
      class="m-0 p-0 text-left text-lg-right list-unstyled"
    >
      <template
        v-for="(value, index) of displayValues.values"
      >
        <template
          v-if="value.about"
        >
          <li
            v-for="(nestedValue, nestedIndex) of value.values"
            :key="index + '_' + nestedIndex"
            :lang="value.code"
            data-qa="entity value"
          >
            <EntityField
              :value="nestedValue"
              :about="value.about"
            />
          </li>
        </template>
        <template v-else-if="fieldData.url">
          <li
            :key="index"
            :lang="langMappedValues.code"
            data-qa="entity link"
          >
            <SmartLink
              :destination="fieldData.url"
              :link-class="name === 'edmDataProvider' ? 'view-at' : null"
            >
              {{ value }}
            </SmartLink>
          </li>
        </template>
        <li
          v-else
          :key="index"
          :lang="langMappedValues.code"
          data-qa="literal value"
        >
          <template>
            {{ value }}
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';
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
      },
      location: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      displayValues() {
        const display = Object.assign({}, this.langMappedValues);

        if (this.limitDisplayValues && (display.values.length > this.limit)) {
          display.values = display.values.slice(0, this.limit).concat(this.$t('formatting.ellipsis'));
        }
        return display;
      },

      limitDisplayValues() {
        return (this.limit > -1);
      },

      langMappedValues() {
        if (this.fieldData === null) {
          return null;
        } else if (typeof (this.fieldData) === 'string') {
          return { values: [this.fieldData], code: '' };
        } else if (Array.isArray(this.fieldData)) {
          return { values: this.fieldData, code: '' };
        } else if (Object.prototype.hasOwnProperty.call(this.fieldData, 'url')) {
          return langMapValueForLocale(this.fieldData.value, this.$i18n.locale);
        }
        return langMapValueForLocale(this.fieldData, this.$i18n.locale, { omitUrisIfOtherValues: this.omitUrisIfOtherValues, omitAllUris: this.omitAllUris });
      },

      hasValuesForLocale() {
        if (this.langMappedValues === null) {
          return null;
        }
        return this.langMappedValues.values.length >= 1;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

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

  .location .metadata-row {
    margin-left: 2rem;
    ul {
      font-weight: 400;
      text-align: left !important;
    }
  }
</style>
