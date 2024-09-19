<template>
  <transition
    appear
    name="fade"
  >
    <div
      class="iiif-viewer-sidebar border-bottom"
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
        >
          <template #title>
            <span
              v-b-tooltip.bottom
              :title="$t('media.sidebar.links')"
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

</style>
