<template>
  <div>
    <b-card
      no-body
      class="mb-3"
    >
      <b-tabs card>
        <b-tab
          :title="$t('record.goodToKnow')"
          active
        >
          <b-card-text
            text-tag="div"
            data-qa="main metadata section"
          >
            <MetadataField
              v-for="(value, name) in coreMetadata"
              :key="name"
              :name="name"
              :field-data="value"
            />
          </b-card-text>
        </b-tab>
        <b-tab
          :title="$t('record.allMetaData')"
        >
          <b-card-text
            text-tag="div"
          >
            <MetadataField
              v-for="(value, name) in allMetadata"
              :key="name"
              :name="name"
              :field-data="value"
            />
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="Boolean(transcribingAnnotations.length)"
          :title="$t('record.transcription')"
        >
          <b-card-text
            text-tag="div"
          >
            <p
              class="disclaimer px-2 pb-3 d-flex"
            >
              {{ $t('record.transcriptionDisclaimer') }}
            </p>
            <div
              v-for="(transcription, index) in transcribingAnnotations"
              :key="index"
              :lang="transcription.body.language"
            >
              <p>{{ transcription.body.value }}</p>
              <hr
                v-if="index !== (transcribingAnnotations.length - 1)"
              >
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="location"
          :title="$t('record.location')"
          active
          class="location"
        >
          <b-card-text
            text-tag="div"
            data-qa="location section"
          >
            <p
              class="disclaimer px-2 pb-3 d-flex"
            >
              <MetadataField
                name="Location"
                :field-data="location"
                location
              />
            </p>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import MetadataField from './MetadataField';
  export default {
    name: 'MetadataBox',
    components: {
      MetadataField
    },

    props: {
      coreMetadata: {
        type: Object,
        default: null
      },
      allMetadata: {
        type: Object,
        default: null
      },
      transcribingAnnotations: {
        type: Array,
        default: () => []
      },
      location: {
        type: Object,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';
  @import './assets/scss/icons.scss';

  .disclaimer {
    align-items: center;
    border-bottom: 1px solid $lightbluemagenta;

    &:before {
      @extend .icon-font;
      content: '\e91f';
      color: $blue;
      font-size: 1.5rem;
      line-height: initial;
      margin-right: 0.5rem;
    }
  }

  .location .disclaimer {
    position: relative;
    &:before {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>

