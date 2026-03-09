<template>
  <div
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
        v-for="(item, index) of displayValues"
      >
        <li
          :key="index"
          :lang="item.lang"
          :data-qa="item.url ? 'entity link' : 'entity value'"
        >
          <ItemDebiasField
            v-if="isDeBiased"
            :key="index"
            :data-value="item.value"
            :name="name"
            :text="item.value"
            :lang="langAttribute(item.lang)"
            tag="li"
            data-qa="de-bias term"
          />
          <SmartLink
            v-else-if="item.url"
            :destination="item.url"
          >
            {{ item.value || item.id }}
          </SmartLink>
          <template
            v-else
          >
            {{ item.value || item.id }}
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  // import { langMapValueForLocale } from '@europeana/i18n';
  import ItemDebiasField from '../item/ItemDebiasField';
  import MetadataOriginLabel from './MetadataOriginLabel';
  import SmartLink from '../generic/SmartLink';
  import itemPrefLanguageMixin from '@/mixins/europeana/item/itemPrefLanguage';
  import langAttributeMixin from '@/mixins/langAttribute';

  export default {
    name: 'MetadataField',

    components: {
      ItemDebiasField,
      MetadataOriginLabel,
      SmartLink
    },

    mixins: [
      itemPrefLanguageMixin,
      langAttributeMixin
    ],

    inject: [
      'deBias',
      'entities'
    ],

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
        type: Object,
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
        let display = [].concat(this.fieldData);

        if (this.limitDisplayValues && (display.length > this.limit)) {
          display = display.slice(0, this.limit).concat('…');
        }

        return display;
      },

      isDeBiased() {
        return !!this.deBias.terms[this.name];
      },

      limitDisplayValues() {
        return (this.limit > -1);
      },

      // prefLanguage() {
      //   return this.getPrefLanguage(this.name, this.fieldData);
      // },

      // langMappedValues() {
      //   if (this.fieldData === null) {
      //     return null;
      //   } else if (typeof (this.fieldData) === 'string') {
      //     return { values: [this.fieldData], code: '' };
      //   } else if (Array.isArray(this.fieldData)) {
      //     return { values: this.fieldData, code: '' };
      //   } else if (Object.prototype.hasOwnProperty.call(this.fieldData, 'url')) {
      //     return langMapValueForLocale(this.fieldData.value, this.prefLanguage);
      //   }
      //   return langMapValueForLocale(this.fieldData, this.prefLanguage, {
      //     omitUrisIfOtherValues: this.omitUrisIfOtherValues, omitAllUris: this.omitAllUris
      //   });
      // },

      // hasValuesForLocale() {
      //   return (this.langMappedValues?.values?.length || 0) >= 1;
      // },

      timestampIsUnixEpochValue() {
        if (['timestampCreated', 'timestampUpdate'].includes(this.name)) {
          return new Date(this.fieldData).getTime() === 0;
        } else {
          return false;
        }
      }

      // TODO: move this up higher
      // isValidFieldData() {
      //   return (this.fieldData?.length || 0) > 0 &&
      //     !this.timestampIsUnixEpochValue &&
      //     // QUESTION: why are we not displaying the UGC value despite it reaching this component?
      //     (this.name !== 'edmUgc');
      // }
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
