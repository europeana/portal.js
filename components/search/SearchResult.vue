<template>
  <b-media
    no-body
    class="flex-column-reverse flex-md-row"
  >
    <b-media-body class="m-4">
      <div
        v-if="localisedHeading"
        :lang="localisedHeading.code"
        :data-field-name="localisedHeadingFieldName"
      >
        <!-- TODO: this is _list_ view... do we need to truncate? -->
        {{ localisedHeading.values[0] | truncate(90, $t('formatting.ellipsis')) }}
      </div>
      <div
        lang=""
        data-field-name="edmDataProvider"
      >
        {{ edmDataProvider[0] }}
      </div>
      <MetadataField
        name="dcCreator"
        :field-data="dcCreator"
        :limit="LIMIT_CREATORS"
        :labelled="false"
        :omit-uris-if-other-values="true"
      />
    </b-media-body>
    <b-media-aside class="media-image">
      <b-img-lazy
        slot="aside"
        :src="edmPreview"
        alt=""
        class="mw-100 w-100"
        data-field-name="edmPreview"
        data-qa="result thumbnail"
      />
    </b-media-aside>
  </b-media>
</template>

<script>
  import MetadataField from '../record/MetadataField';
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';

  export default {
    name: 'SearchResult',

    components: {
      MetadataField
    },

    props: {
      edmPreview: {
        type: String,
        required: true
      },

      // only ever a single value, but in an array for some reason
      edmDataProvider: {
        type: Array,
        required: true
      },

      // lang map
      dcTitle: {
        type: Object,
        default: () => {}
      },

      // lang map
      dcDescription: {
        type: Object,
        default: () => {}
      },

      // lang map
      dcCreator: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        LIMIT_CREATORS: 3
      };
    },

    computed: {
      localisedHeadingFieldName() {
        return this.dcTitle ? 'dcTitle' : (this.dcDescription ? 'dcDescription' : null);
      },

      localisedHeading() {
        return langMapValueForLocale(this.dcTitle || this.dcDescription || {}, this.$i18n.locale, { omitUrisIfOtherValues: true });
      }
    }
  };
</script>
