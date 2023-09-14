import theme from './theme.js';

export default {
  data() {
    return {
      MIRADOR_VERSION: '3.3.0-rc2',
      isMiradorLoaded: process.client ? !!window.Mirador : false,
      miradorManifestUri: null,
      miradorTheme: theme,
      miradorViewer: null,
      miradorViewerPlugins: [],
      // Doc: https://github.com/ProjectMirador/mirador/blob/v3.3.0/src/config/settings.js
      miradorViewerOptions: {
        id: 'viewer',
        windows: [
          {
            manifestId: this.miradorManifestUri,
            thumbnailNavigationPosition: 'off'
          }
        ],
        window: {
          allowClose: false,
          allowFullscreen: true,
          allowMaximize: false,
          allowTopMenuButton: false,
          allowWindowSideBar: false,
          sideBarOpen: false,
          panels: {
            info: false,
            attribution: false,
            canvas: false,
            annotations: true,
            search: true
          },
          views: [
            { key: 'single' },
            { key: 'book' },
            { key: 'gallery' }
          ]
        },
        language: this.$i18n.locale,
        workspace: {
          showZoomControls: true,
          type: 'mosaic'
        },
        workspaceControlPanel: {
          enabled: false
        },
        annotations: {
          filteredMotivations: ['transcribing', 'supplementing', 'oa:commenting', 'oa:tagging', 'sc:painting', 'commenting', 'tagging']
        },
        requests: {
          preprocessors: [],
          postprocessors: []
        },
        selectedTheme: 'europeana',
        themes: {
          europeana: theme
        },
        osdConfig: {
          gestureSettingsMouse: {
            scrollToZoom: false
          }
        }
      }
    };
  },

  created() {
    // Initialise the manifest ID from the data property set in the component
    this.miradorViewerOptions.windows[0].manifestId = this.miradorManifestUri;
  },

  mounted() {
    this.loadMirador();
  },

  beforeDestroy() {
    // NOTE: very important to do this, as it cleans up all the
    //       mirador/react/material stuff from the DOM before moving on
    this.miradorViewer?.unmount();
  },

  methods: {
    loadMirador() {
      if (this.isMiradorLoaded) {
        this.initMirador();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://cdn.jsdelivr.net/npm/@europeana/mirador-ec-6478@${this.MIRADOR_VERSION}/dist/europeana-mirador.js`
      script.onload = this.initMirador;
      document.head.appendChild(script);

      this.isMiradorLoaded = true;
    },

    initMirador() {
      if (!this.miradorViewerOptions.windows[0].manifestId) {
        return;
      }

      this.miradorViewer = window.Mirador.viewer(this.miradorViewerOptions, this.miradorViewerPlugins);
    }
  }
};
