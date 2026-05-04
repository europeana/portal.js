<template>
  <div>
    <div
      v-for="wr, index in webResources"
      :key="wr.about"
      class="collapsable-section"
    >
      <b-button
        v-b-toggle="`collapse-${index}`"
        variant="link"
        class="dropdown-toggle"
      >
        {{ mediaDownloadLabel(wr) }}
      </b-button>
      <b-collapse
        :id="`collapse-${index}`"
        class="mt-2"
      >
        <MediaMetadataList
          :web-resource="wr"
        />
      </b-collapse>
    </div>
  </div>
</template>

<script>
  import { mediaDownloadLabel } from '@/utils/media/mediaDownloadLabel.js';
  import MediaMetadataList from '../media/MediaMetadataList.vue';
  import WebResource from '@/plugins/europeana/edm/WebResource';

  export default {
    name: 'MediaMetadataCollapseList',

    components: {
      MediaMetadataList
    },

    props: {
      webResources: {
        type: Array,
        default: () => [],
        validator: (prop) => Array.isArray(prop) && prop.every((item) => item instanceof WebResource)
      }
    },

    methods: {
      mediaDownloadLabel
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .collapsable-section {
    ::v-deep .media-viewer-metadata-list {
      border-top: none;

      li {
        &:first-child .metadata-row {
          padding-top: 0 !important;
        }
      }
    }
  }

  .dropdown-toggle {
    font-size: $font-size-small;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    width: 100%;
    text-align: left;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid transparent;

    &:focus {
      box-shadow: none;
    }

    &::after {
      font-size: 0.5rem;
    }

    &.collapsed {
      border-bottom: 1px solid $lightbluemagenta;
    }

    &.not-collapsed:after {
      transform: rotateX(180deg);
    }
  }
</style>
