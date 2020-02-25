<template>
  <b-media
    no-body
    class="flex-column-reverse flex-md-row"
  >
    <b-media-body class="m-4">
      <div
        v-if="localisedTitle.values.length > 0"
        :lang="localisedTitle.code"
        class="is-size-3 font-weight-bold"
        data-field-name="dcTitle"
      >
        <!-- TODO: this is _list_ view... do we need to truncate? -->
        {{ localisedTitle.values[0] | truncate(90, $t('formatting.ellipsis')) }}
      </div>
      <p
        v-if="localisedDescription.values.length > 0"
        :class="{ 'is-size-3 font-weight-bold': localisedTitle.values.length === 0 }"
        :lang="localisedDescription.code"
        data-field-name="dcDescription"
      >
        {{ localisedDescription.values[0] | truncate(510, $t('formatting.ellipsis')) }}
      </p>
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
        LIMIT_CREATORS: 6
      };
    },

    computed: {
      localisedTitle() {
        return langMapValueForLocale(this.dcTitle || {}, this.$i18n.locale, { omitUrisIfOtherValues: true });
      },

      localisedDescription() {
        return langMapValueForLocale(this.dcDescription || {}, this.$i18n.locale, { omitUrisIfOtherValues: true });
      }
    }
  };
</script>
