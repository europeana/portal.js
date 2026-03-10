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
      <MetadataOriginLabel
        :source="source"
      />
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
            {{ item.value || item.id || item }}
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  import ItemDebiasField from '../item/ItemDebiasField';
  import MetadataOriginLabel from './MetadataOriginLabel';
  import SmartLink from '../generic/SmartLink';
  import langAttributeMixin from '@/mixins/langAttribute';

  export default {
    name: 'MetadataField',

    components: {
      ItemDebiasField,
      MetadataOriginLabel,
      SmartLink
    },

    mixins: [
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
        type: Array,
        default: () => []
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

      // TODO: should we reduce this to one, or should we show the (potentially
      //       different) source for each?
      source() {
        return this.fieldData.map((item) => item.source).filter(Boolean)[0];
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
