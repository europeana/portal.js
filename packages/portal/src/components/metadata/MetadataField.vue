<template>
  <div
    v-if="isValidFieldData && hasValuesForLocale"
    :data-field-name="name"
    data-qa="metadata field"
    class="metadata-row"
  >
    <h3
      v-if="labelled"
      :id="labelId"
      data-qa="label"
      class="m-0"
      :class="{ 'mb-1': context === 'webResource' }"
    >
      {{ displayLabel }}
    </h3>
    <ul
      class="m-0 p-0 text-left list-unstyled"
      :aria-labelledby="labelled && labelId"
      :class="{ 'text-lg-right': context === 'default' }"
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
          :class="{ 'colour-swatch-list-item': isColourValue }"
        >
          <template v-if="isColourValue">
            <ColourSwatch
              :hex-code="value"
            />
            <span>
              {{ $t(`facets.COLOURPALETTE.options.${value}`) }}
            </span>
          </template>
          <SmartLink
            v-else-if="fieldData.url"
            :destination="fieldData.url"
          >
            <span>{{ value }}</span>
          </SmartLink>
          <template
            v-else-if="isNumberValue(value)"
          >
            {{ $i18n.n(value) }}
          </template>
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
  import camelCase from 'lodash/camelCase.js';
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
      ColourSwatch: () => import('@/components/generic/ColourSwatch'),
      ItemDebiasField,
      ItemEntityField,
      MetadataOriginLabel,
      SmartLink
    },

    mixins: [
      itemPrefLanguageMixin,
      langAttributeMixin
    ],

    inject: ['deBias', 'metadataLanguage'],

    props: {
      name: {
        type: String,
        default: ''
      },
      fieldData: {
        type: [String, Object, Array, Number],
        default: null
      },
      /**
       * Context of the metadata
       * @values default, webResource
       */
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
      nameWithoutContext() {
        if (this.name.startsWith(this.context)) {
          return camelCase(this.name.replace(this.context, ''));
        }
        return this.name;
      },
      displayLabel() {
        if (this.$te(`fieldLabels.${this.context}.${this.nameWithoutContext}`)) {
          return this.$t(`fieldLabels.${this.context}.${this.nameWithoutContext}`);
        }

        if (this.context !== 'default') {
          if (this.$te(`fieldLabels.default.${this.nameWithoutContext}`)) {
            return this.$t(`fieldLabels.default.${this.nameWithoutContext}`);
          }
        }

        return this.name;
      },
      displayValues() {
        const display = { ...this.langMappedValues };

        if (this.limitDisplayValues && (display.values.length > this.limit)) {
          display.values = display.values.slice(0, this.limit).concat('…');
        }

        display.values = display.values.map((value) => {
          if (value.startsWith?.('http://') || value.startsWith?.('https://')) {
            const termId = camelCase(value.split('/').pop());
            if (this.$te(`fieldValues.${this.name}.${termId}`)) {
              return this.$t(`fieldValues.${this.name}.${termId}`);
            }
          }
          return value;
        });

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
        } else if (['string', 'number'].includes(typeof (this.fieldData))) {
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
      },

      isColourValue() {
        return this.name === 'edmComponentColor';
      }
    },

    methods: {
      isNumberValue(value) {
        return typeof value === 'number';
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .metadata-row {
    border-bottom: 1px solid $lightbluemagenta;
    font-size: $font-size-small;
    padding: 1rem 0;

    &:first-child {
      padding-top: 0;
    }

    h3 {
      font-size: $font-size-small;
      line-height: 1.5;
    }

    ul {
      font-weight: 600;

      li {
        display: inline;

        &.colour-swatch-list-item {
          display: block;
        }

        &:not(:last-child):not(.colour-swatch-list-item)::after {
          content: ';';
          padding: 0 0.2rem;
        }

        .is-external-link {
          display: inline-flex;
          text-decoration: none;

          span:first-child {
            text-decoration: underline;
          }

          .icon-external-link {
            line-height: 1.5;
            margin-left: 0.25rem;
          }
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
