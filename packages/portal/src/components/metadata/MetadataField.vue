<template>
  <div
    v-if="isValidFieldData"
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
      <li
        v-for="(value, index) of displayValues"
        :key="index"
        :lang="langAttribute(value.lang)"
      >
        <MetadataOriginLabel :translation-source="value.translationSource" />
        <SmartLink
          v-if="value.url"
          :destination="value.url"
        >
          {{ value.value }}
        </SmartLink>
        <!-- TODO: can't this just use SmartLink with url set for the entity page? -->
        <ItemEntityField
          v-else-if="value.about"
          :text="value.value"
          :about="value.about"
        />
        <template
          v-else
        >
          {{ value.value }}
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
  import ItemEntityField from '../item/ItemEntityField';
  import MetadataOriginLabel from './MetadataOriginLabel';
  import SmartLink from '../generic/SmartLink';
  import itemPrefLanguageMixin from '@/mixins/europeana/item/itemPrefLanguage';
  import langAttributeMixin from '@/mixins/langAttribute';

  export default {
    name: 'MetadataField',

    components: {
      ItemEntityField,
      MetadataOriginLabel,
      SmartLink
    },

    mixins: [
      itemPrefLanguageMixin,
      langAttributeMixin
    ],

    props: {
      name: {
        type: String,
        required: true
      },
      fieldData: {
        type: Array,
        required: true
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
        if (!this.limitDisplayValues) {
          return this.fieldData;
        }
        return this.fieldData.slice(0, this.limit).concat('…');
      },

      limitDisplayValues() {
        return (this.limit > -1);
      },

      timestampIsUnixEpochValue() {
        if (['timestampCreated', 'timestampUpdate'].includes(this.name)) {
          return new Date(this.fieldData[0].value).getTime() === 0;
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
