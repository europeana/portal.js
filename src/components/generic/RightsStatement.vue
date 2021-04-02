<template>
  <span data-qa="rights statement">
    <span
      v-for="icon in rightsNameAndIcon.iconClass"
      :key="icon"
      :class="icon"
      class="license"
    />
    {{ rightsNameAndIcon.name }}
  </span>
</template>

<script>
  export default {
    props: {
      rightsStatementUrl: {
        type: String,
        required: true
      }
    },
    computed: {
      rightsNameAndIcon() {
        const val = this.rightsStatementUrl;
        const rights = {};

        // TODO: localise the names?
        switch (true) {
        case new RegExp('https?://creativecommons.org/(licenses/)?publicdomain/mark').test(val):
          rights.name = 'Public Domain';
          rights.iconClass = ['icon-license-pd'];
          break;
        case new RegExp('https?://creativecommons.org/(licenses/)?publicdomain/zero').test(val):
          rights.name = 'CC0';
          rights.iconClass = ['icon-license-zero'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by/').test(val):
          rights.name = 'CC BY';
          rights.iconClass = ['icon-license-cc', 'icon-license-by'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-sa/').test(val):
          rights.name = 'CC BY-SA';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-sa'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc/').test(val):
          rights.name = 'CC BY-NC';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-nc'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc-sa/').test(val):
          rights.name = 'CC BY-NC-SA';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-nc', 'icon-license-sa'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc-nd/').test(val):
          rights.name = 'CC BY-NC-ND';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-nc', 'icon-license-nd'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nd/').test(val):
          rights.name = 'CC BY-ND';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-nd'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/out-of-copyright-non-commercial/').test(val):
          rights.name = 'No Copyright - Non-Commercial Use Only';
          rights.iconClass = ['icon-license-rs-no'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC-EDU/').test(val):
          rights.name = 'In Copyright - Educational Use Permitted';
          rights.iconClass = ['icon-license-rs-yes'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/NoC-NC/').test(val):
          rights.name = 'No Copyright - Non-Commercial Use Only';
          rights.iconClass = ['icon-license-rs-no'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/NoC-OKLR/').test(val):
          rights.name = 'No Copyright - Other Known Legal Restrictions';
          rights.iconClass = ['icon-license-rs-no'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-f/').test(val):
          rights.name = 'Rights Reserved - Free Access';
          rights.iconClass = ['icon-license-rr'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-p/').test(val):
          rights.name = 'Rights Reserved - Paid Access';
          rights.iconClass = ['icon-license-rr'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-r/').test(val):
          rights.name = 'Rights Reserved - Restricted Access';
          rights.iconClass = ['icon-license-rr'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/unknown/').test(val):
          rights.name = 'Unknown copyright status';
          rights.iconClass = [];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC/').test(val):
          rights.name = 'In Copyright';
          rights.iconClass = ['icon-license-rs-yes'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC-OW-EU/').test(val):
          rights.name = 'In Copyright - EU Orphan Work';
          rights.iconClass = ['icon-license-rs-yes'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/CNE/').test(val):
          rights.name = 'Copyright Not Evaluated';
          rights.iconClass = ['icon-license-rs-unknown'];
          break;
        default:
          rights.name = val;
          break;
        }

        return rights;
      }
    }
  };
</script>
