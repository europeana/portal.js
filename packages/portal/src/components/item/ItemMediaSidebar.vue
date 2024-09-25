<template>
  <transition
    appear
    name="fade"
  >
    <div
      class="iiif-viewer-sidebar border-bottom"
      data-qa="item media sidebar"
    >
      <b-tabs vertical>
        <b-tab
          v-if="!!annotationPage"
        >
          <template #title>
            <!-- TODO: label for a11y -->
            <!-- TODO: replace with new icon for annotations -->
            <span class="icon icon-text-bold" />
          </template>
          <!-- <IIIFAnnotationList
                    v-if="!!annotationPage"
                    :uri="annotationPage.url.toString()"
                    class="iiif-viewer-sidebar-panel"
                    @clickAnno="onClickAnno"
                  /> -->
        </b-tab>
        <b-tab
          v-if="!!uri"
          data-qa="item media sidebar links"
          button-id="item-media-sidebar-links"
          @mouseleave.native="hideTooltips"
        >
          <b-tooltip
            target="item-media-sidebar-links"
            :title="$t('media.sidebar.links')"
            boundary=".iiif-viewer-sidebar"
          />
          <template #title>
            <span
              :aria-label="$t('media.sidebar.links')"
              class="icon icon-link"
            />
          </template>
          <h2>{{ $t('media.sidebar.links') }}</h2>
          <h3>{{ $t('media.sidebar.IIIFManifest') }}</h3>
          <b-link
            :href="uri"
          >
            {{ uri }}
          </b-link>
        </b-tab>
      </b-tabs>
    </div>
  </transition>
</template>

<script>
  import { BTab, BTabs } from 'bootstrap-vue';

  export default {
    name: 'ItemMediaSidebar',

    components: {
      BTab,
      BTabs
    },

    props: {
      annotationPage: {
        type: Object,
        default: null
      },
      uri: {
        type: String,
        default: null
      }
    },

    methods: {
      hideTooltips() {
        this.$root.$emit('bv::hide::tooltip');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

  .iiif-viewer-sidebar {
    flex-basis: 260px;
    flex-shrink: 0;

    ::v-deep .tab-content {
      padding: 1rem 1.5rem 1rem 0.875rem;
      overflow: auto;

      h2 {
        font-size: 1.125rem;
      }

      h3 {
        font-size: $font-size-base;
        margin-bottom: 0.5rem;
      }

      a {
        overflow-wrap: anywhere;
        color: $blue;
        font-size: $font-size-small;
      }
    }

    .icon {
      font-size: $font-size-large;
    }
  }
</style>
