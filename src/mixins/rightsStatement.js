export default {
  methods: {
    rightsNameAndIcon(rightsStatementUrl) {
      const rights = {};

      // TODO: localise the names?
      switch (true) {
        case new RegExp('https?://creativecommons.org/(licenses/)?publicdomain/mark').test(rightsStatementUrl):
          rights.name = 'Public Domain';
          rights.iconClass = ['icon-license-pd'];
          break;
        case new RegExp('https?://creativecommons.org/(licenses/)?publicdomain/zero').test(rightsStatementUrl):
          rights.name = 'CC0';
          rights.iconClass = ['icon-license-zero'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by/').test(rightsStatementUrl):
          rights.name = 'CC BY';
          rights.iconClass = ['icon-license-cc', 'icon-license-by'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-sa/').test(rightsStatementUrl):
          rights.name = 'CC BY-SA';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-sa'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc/').test(rightsStatementUrl):
          rights.name = 'CC BY-NC';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-nc'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc-sa/').test(rightsStatementUrl):
          rights.name = 'CC BY-NC-SA';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-nc', 'icon-license-sa'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc-nd/').test(rightsStatementUrl):
          rights.name = 'CC BY-NC-ND';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-nc', 'icon-license-nd'];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nd/').test(rightsStatementUrl):
          rights.name = 'CC BY-ND';
          rights.iconClass = ['icon-license-cc', 'icon-license-by', 'icon-license-nd'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/out-of-copyright-non-commercial/').test(rightsStatementUrl):
          rights.name = 'No Copyright - Non-Commercial Use Only';
          rights.iconClass = ['icon-license-rs-no'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC-EDU/').test(rightsStatementUrl):
          rights.name = 'In Copyright - Educational Use Permitted';
          rights.iconClass = ['icon-license-rs-yes'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/NoC-NC/').test(rightsStatementUrl):
          rights.name = 'No Copyright - Non-Commercial Use Only';
          rights.iconClass = ['icon-license-rs-no'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/NoC-OKLR/').test(rightsStatementUrl):
          rights.name = 'No Copyright - Other Known Legal Restrictions';
          rights.iconClass = ['icon-license-rs-no'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-f/').test(rightsStatementUrl):
          rights.name = 'Rights Reserved - Free Access';
          rights.iconClass = ['icon-license-rr'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-p/').test(rightsStatementUrl):
          rights.name = 'Rights Reserved - Paid Access';
          rights.iconClass = ['icon-license-rr'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-r/').test(rightsStatementUrl):
          rights.name = 'Rights Reserved - Restricted Access';
          rights.iconClass = ['icon-license-rr'];
          break;
        case new RegExp('https?://www.europeana.eu/rights/unknown/').test(rightsStatementUrl):
          rights.name = 'Unknown copyright status';
          rights.iconClass = [];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC/').test(rightsStatementUrl):
          rights.name = 'In Copyright';
          rights.iconClass = ['icon-license-rs-yes'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC-OW-EU/').test(rightsStatementUrl):
          rights.name = 'In Copyright - EU Orphan Work';
          rights.iconClass = ['icon-license-rs-yes'];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/CNE/').test(rightsStatementUrl):
          rights.name = 'Copyright Not Evaluated';
          rights.iconClass = ['icon-license-rs-unknown'];
          break;
        default:
          rights.name = rightsStatementUrl;
          break;
      }

      return rights;
    }
  }
};
