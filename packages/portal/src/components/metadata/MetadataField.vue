<template>
  <div
    v-if="isValidFieldData && hasValuesForLocale"
    :data-field-name="name"
    data-qa="metadata field"
    class="metadata-row d-lg-flex"
  >
    <h3
      v-if="labelled"
      :id="labelId"
      data-qa="label"
      class="m-0"
    >
      {{ $t(`fieldLabels.${context}.${name}`) }}
    </h3>
    <ul
      class="m-0 p-0 text-left text-lg-right list-unstyled"
      :aria-labelledby="labelled && labelId"
    >
      <MetadataOriginLabel :translation-source="fieldData.translationSource" />
      <template
        v-for="(value, index) of displayValues.values"
      >
        <template
          v-if="value.about"
        >
          <li
            v-for="(nestedValue, nestedIndex) of value.values"
            :key="index + '_' + nestedIndex"
            :lang="langAttribute(value.code)"
            :data-qa="fieldData.url ? 'entity link' : 'entity value'"
          >
            <SmartLink
              v-if="fieldData.url"
              :destination="fieldData.url"
            >
              {{ nestedValue }}
            </SmartLink>
            <ItemEntityField
              v-else
              :text="nestedValue"
              :about="value.about"
            />
          </li>
        </template>
        <ItemDebiasField
          v-else-if="isDeBiased"
          :key="index"
          :data-value="value"
          :name="name"
          :text="value"
          :lang="langAttribute(langMappedValues.code)"
          tag="li"
          data-qa="de-bias term"
        />
        <li
          v-else
          :key="index"
          :lang="langAttribute(langMappedValues.code)"
          data-qa="literal value"
        >
          <SmartLink
            v-if="fieldData.url"
            :destination="fieldData.url"
          >
            {{ value }}
          </SmartLink>
          <template
            v-else
          >
            {{ value }}
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  import { langMapValueForLocale } from '@europeana/i18n';
  import ItemDebiasField from '../item/ItemDebiasField';
  import ItemEntityField from '../item/ItemEntityField';
  import MetadataOriginLabel from './MetadataOriginLabel';
  import SmartLink from '../generic/SmartLink';
  import itemPrefLanguageMixin from '@/mixins/europeana/item/itemPrefLanguage';
  import langAttributeMixin from '@/mixins/langAttribute';

  export default {
    name: 'MetadataField',

    components: {
      ItemDebiasField,
      ItemEntityField,
      MetadataOriginLabel,
      SmartLink
    },

    mixins: [
      itemPrefLanguageMixin,
      langAttributeMixin
    ],

    inject: ['deBias'],

    props: {
      name: {
        type: String,
        default: ''
      },
      metadataLanguage: {
        type: String,
        default: null
      },
      fieldData: {
        type: [String, Object, Array],
        default: null
      },
      context: {
        type: String,
        default: 'default'
      },
      labelId: {
        type: String,
        default: null
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
        const display = { ...this.langMappedValues };

        if (this.limitDisplayValues && (display.values.length > this.limit)) {
          display.values = display.values.slice(0, this.limit).concat('…');
        }
        return display;
      },

      isDeBiased() {
        return !!this.deBias.terms[this.name];
      },

      limitDisplayValues() {
        return (this.limit > -1);
      },

      prefLanguage() {
        return this.getPrefLanguage(this.name, this.fieldData);
      },

      langMappedValues() {
        if (this.fieldData === null) {
          return null;
        } else if (typeof (this.fieldData) === 'string') {
          return { values: [this.fieldData], code: '' };
        } else if (Array.isArray(this.fieldData)) {
          return { values: this.fieldData, code: '' };
        } else if (Object.prototype.hasOwnProperty.call(this.fieldData, 'url')) {
          return langMapValueForLocale(this.fieldData.value, this.prefLanguage);
        }
        return langMapValueForLocale(this.fieldData, this.prefLanguage, {
          omitUrisIfOtherValues: this.omitUrisIfOtherValues, omitAllUris: this.omitAllUris
        });
      },

      hasValuesForLocale() {
        return (this.langMappedValues?.values?.length || 0) >= 1;
      },

      timestampIsUnixEpochValue() {
        if (['timestampCreated', 'timestampUpdate'].includes(this.name)) {
          return new Date(this.fieldData).getTime() === 0;
        } else {
          return false;
        }
      },

      isValidFieldData() {
        return !this.timestampIsUnixEpochValue && (this.name !== 'edmUgc');
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .metadata-row {
    border-bottom: 1px solid #e7e7e9;
    font-size: $font-size-small;
    padding: 1rem 0;

    &:first-child {
      padding-top: 0;
    }

    h3 {
      font-size: inherit;
      line-height: 1.5;
    }

    ul {
      font-weight: 600;

      li {
        display: inline;

        &:not(:last-child)::after {
          content: ';';
          padding: 0 0.2rem;
        }

        ::v-deep .icon-external-link {
          vertical-align: initial;
          font-size: 0.75rem;
        }
      }
    }

    @media (min-width: $bp-large) {
      h3,
      ul {
        flex: 1;
      }
    }
  }
</style>
