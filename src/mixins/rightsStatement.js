const ICON_CLASS_BY = 'icon-license-by';
const ICON_CLASS_CC = 'icon-license-cc';
const ICON_CLASS_COPYRIGHT_NOT_EVALUATED = 'icon-license-rs-unknown';
const ICON_CLASS_IN_COPYRIGHT = 'icon-license-rs-yes';
const ICON_CLASS_NC = 'icon-license-nc';
const ICON_CLASS_ND = 'icon-license-nd';
const ICON_CLASS_NO_COPYRIGHT = 'icon-license-rs-no';
const ICON_CLASS_PUBLIC_DOMAIN = 'icon-license-pd';
const ICON_CLASS_RIGHTS_RESERVED = 'icon-license-rr';
const ICON_CLASS_SA = 'icon-license-sa';
const ICON_CLASS_ZERO = 'icon-license-zero';

export default {
  methods: {
    rightsNameAndIcon(rightsStatementUrl) {
      const rights = {};

      switch (true) {
        case new RegExp('https?://creativecommons.org/(licenses/)?publicdomain/mark').test(rightsStatementUrl):
          rights.name = 'Public Domain';
          rights.iconClass = [ICON_CLASS_PUBLIC_DOMAIN];
          break;
        case new RegExp('https?://creativecommons.org/(licenses/)?publicdomain/zero').test(rightsStatementUrl):
          rights.name = 'CC0';
          rights.iconClass = [ICON_CLASS_ZERO];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by/').test(rightsStatementUrl):
          rights.name = 'CC BY';
          rights.iconClass = [ICON_CLASS_CC, ICON_CLASS_BY];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-sa/').test(rightsStatementUrl):
          rights.name = 'CC BY-SA';
          rights.iconClass = [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_SA];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc/').test(rightsStatementUrl):
          rights.name = 'CC BY-NC';
          rights.iconClass = [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_NC];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc-sa/').test(rightsStatementUrl):
          rights.name = 'CC BY-NC-SA';
          rights.iconClass = [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_NC, ICON_CLASS_SA];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nc-nd/').test(rightsStatementUrl):
          rights.name = 'CC BY-NC-ND';
          rights.iconClass = [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_NC, ICON_CLASS_ND];
          break;
        case new RegExp('https?://creativecommons.org/licenses/by-nd/').test(rightsStatementUrl):
          rights.name = 'CC BY-ND';
          rights.iconClass = [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_ND];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC-EDU/').test(rightsStatementUrl):
          rights.name = 'In Copyright - Educational Use Permitted';
          rights.iconClass = [ICON_CLASS_IN_COPYRIGHT];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/NoC-NC/').test(rightsStatementUrl):
        case new RegExp('https?://www.europeana.eu/rights/out-of-copyright-non-commercial/').test(rightsStatementUrl):
          rights.name = 'No Copyright - Non-Commercial Use Only';
          rights.iconClass = [ICON_CLASS_NO_COPYRIGHT];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/NoC-OKLR/').test(rightsStatementUrl):
          rights.name = 'No Copyright - Other Known Legal Restrictions';
          rights.iconClass = [ICON_CLASS_NO_COPYRIGHT];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-f/').test(rightsStatementUrl):
          rights.name = 'Rights Reserved - Free Access';
          rights.iconClass = [ICON_CLASS_RIGHTS_RESERVED];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-p/').test(rightsStatementUrl):
          rights.name = 'Rights Reserved - Paid Access';
          rights.iconClass = [ICON_CLASS_RIGHTS_RESERVED];
          break;
        case new RegExp('https?://www.europeana.eu/rights/rr-r/').test(rightsStatementUrl):
          rights.name = 'Rights Reserved - Restricted Access';
          rights.iconClass = [ICON_CLASS_RIGHTS_RESERVED];
          break;
        case new RegExp('https?://www.europeana.eu/rights/unknown/').test(rightsStatementUrl):
          rights.name = 'Unknown copyright status';
          rights.iconClass = [];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC/').test(rightsStatementUrl):
          rights.name = 'In Copyright';
          rights.iconClass = [ICON_CLASS_IN_COPYRIGHT];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/InC-OW-EU/').test(rightsStatementUrl):
          rights.name = 'In Copyright - EU Orphan Work';
          rights.iconClass = [ICON_CLASS_IN_COPYRIGHT];
          break;
        case new RegExp('https?://rightsstatements.org/(vocab|page)/CNE/').test(rightsStatementUrl):
          rights.name = 'Copyright Not Evaluated';
          rights.iconClass = [ICON_CLASS_COPYRIGHT_NOT_EVALUATED];
          break;
        default:
          rights.name = rightsStatementUrl;
          break;
      }

      return rights;
    }
  }
};
