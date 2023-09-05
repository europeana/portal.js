import theme from './theme.js';

export default {
  data() {
    return {
      isMiradorLoaded: process.client ? !!window.Mirador : false,
      miradorTheme: theme,
      miradorViewer: null
    };
  },

  methods: {
    async loadMirador() {
      if (this.isMiradorLoaded) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mirador@3.3.0/dist/mirador.min.js';
      script.onload = this.initMirador;
      document.head.appendChild(script);

      this.isMiradorLoaded = true;
    },

    async initMirador() {
      this.miradorViewer = window.Mirador.viewer(this.miradorViewerOptions, this.miradorViewerPlugins);
    }
  }
};
