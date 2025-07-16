<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="responsive && height && width"
    ref="responsiveWrapper"
    class="responsive-embed-wrapper"
    :style="`width:${widthWrapper}px`"
    data-qa="responsive embed wrapper"
  >
    <div
      ref="embedContainer"
      data-qa="html embed"
      class="html-embed"
      :style="`padding-bottom:${heightAsPercentOfWidth}%`"
      v-html="embedCode"
    />
  </div>
  <div
    v-else
    ref="embedContainer"
    data-qa="html embed"
    class="html-embed"
    v-html="embedCode"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script>
  export default {
    name: 'EmbedHTML',

    props: {
      html: {
        type: String,
        required: true
      },
      height: {
        type: [Number, String],
        default: null
      },
      width: {
        type: [Number, String],
        default: null
      },
      title: {
        type: String,
        default: null
      },
      responsive: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        embedCode: this.html,
        scripts: [],
        widthWrapper: 0
      };
    },

    computed: {
      heightAsPercentOfWidth() {
        return (this.height * 100) / this.width;
      }
    },

    beforeDestroy() {
      // TODO: is this still needed when we append script to embedContainer ref?
      if (this.scripts.length) {
        this.scripts.forEach(script => script.remove());
      }
    },

    mounted() {
      this.findAndReappendScripts();

      this.setWidthWrapper();
      window.addEventListener('resize', this.setWidthWrapper);

      if (this.title) {
        const iframe = this.$refs.embedContainer.getElementsByTagName('iframe')?.[0];
        iframe?.setAttribute('title', this.title);
      }
    },

    methods: {
      setWidthWrapper() {
        if (this.$refs.responsiveWrapper) {
          const wrapperHeight = this.$refs.responsiveWrapper.clientHeight;
          this.widthWrapper = (this.width * wrapperHeight) / this.height;
        }
      },
      // Reappends scripts so they are executed. Scripts added through v-html are not executed
      findAndReappendScripts() {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.html, 'text/html');
        const scripts = doc.querySelectorAll('script');

        if (scripts.length) {
          scripts.forEach(script => {
            const newScript = document.createElement('script');

            for (let attr of script.attributes) {
              newScript.setAttribute(attr.name, attr.value);
            }

            // for inline script content
            newScript.textContent = script.textContent;

            this.$refs.embedContainer.appendChild(newScript);

            // Store as local state to remove on beforeDestroy
            this.scripts.push(newScript);

            // Workaround as PollUnit does not retrigger initialisation after DOMContentLoaded
            if (newScript.src.includes('https://pollunit.com/embed/')) {
              newScript.onload = () => {
                if (typeof pollUnitInit === 'function') {
                  pollUnitInit();
                }
              };
            }

            script.remove();
          });
          this.embedCode = doc.body.innerHTML;
        } else {
          this.embedCode = this.html;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';

  .html-embed {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    ::v-deep iframe {
      display: inline;
      margin-right: auto;
      margin-left: auto;
      border: 0;
      box-shadow: none;
    }

    ::v-deep .sketchfab-embed-wrapper {
      width: 100%;

      iframe {
        width: 100%;
        @include media-viewer-height;
      }
    }
  }

  .responsive-embed-wrapper {
    @include media-viewer-height;
    margin: 0 auto;
    width: 100%;
    max-width: 100%;

    .html-embed {
      display: block;
      position: relative;
      height: 0;
      overflow: hidden;

      ::v-deep iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
