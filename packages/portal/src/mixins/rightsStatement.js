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

const rightsStatements = [
  {
    name: 'Public Domain',
    iconClass: [ICON_CLASS_PUBLIC_DOMAIN],
    urls: [
      { host: 'creativecommons.org', path: '/publicdomain/mark/' }
    ]
  },
  {
    name: 'CC0',
    iconClass: [ICON_CLASS_ZERO],
    urls: [
      { host: 'creativecommons.org', path: '/publicdomain/zero/' }
    ]
  },
  {
    name: 'CC BY',
    iconClass: [ICON_CLASS_CC, ICON_CLASS_BY],
    urls: [
      { host: 'creativecommons.org', path: '/licenses/by/' }
    ]
  },
  {
    name: 'CC BY-SA',
    iconClass: [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_SA],
    urls: [
      { host: 'creativecommons.org', path: '/licenses/by-sa/' }
    ]
  },
  {
    name: 'CC BY-NC',
    iconClass: [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_NC],
    urls: [
      { host: 'creativecommons.org', path: '/licenses/by-nc/' }
    ]
  },
  {
    name: 'CC BY-NC-SA',
    iconClass: [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_NC, ICON_CLASS_SA],
    urls: [
      { host: 'creativecommons.org', path: '/licenses/by-nc-sa/' }
    ]
  },
  {
    name: 'CC BY-NC-ND',
    iconClass: [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_NC, ICON_CLASS_ND],
    urls: [
      { host: 'creativecommons.org', path: '/licenses/by-nc-nd/' }
    ]
  },
  {
    name: 'CC BY-ND',
    iconClass: [ICON_CLASS_CC, ICON_CLASS_BY, ICON_CLASS_ND],
    urls: [
      { host: 'creativecommons.org', path: '/licenses/by-nd/' }
    ]
  },
  {
    name: 'In Copyright - Educational Use Permitted',
    iconClass: [ICON_CLASS_IN_COPYRIGHT],
    urls: [
      { host: 'rightsstatements.org', path: '/InC-EDU/' }
    ]
  },
  {
    name: 'No Copyright - Non-Commercial Use Only',
    iconClass: [ICON_CLASS_NO_COPYRIGHT],
    urls: [
      { host: 'rightsstatements.org', path: '/NoC-NC/' },
      { host: 'www.europeana.eu', path: '/rights/out-of-copyright-non-commercial/' }
    ]
  },
  {
    name: 'No Copyright - Other Known Legal Restrictions',
    iconClass: [ICON_CLASS_NO_COPYRIGHT],
    urls: [
      { host: 'rightsstatements.org', path: '/NoC-OKLR/' }
    ]
  },
  {
    name: 'Rights Reserved - Free Access',
    iconClass: [ICON_CLASS_RIGHTS_RESERVED],
    urls: [
      { host: 'www.europeana.eu', path: '/rights/rr-f/' }
    ]
  },
  {
    name: 'Rights Reserved - Paid Access',
    iconClass: [ICON_CLASS_RIGHTS_RESERVED],
    urls: [
      { host: 'www.europeana.eu', path: '/rights/rr-p/' }
    ]
  },
  {
    name: 'Rights Reserved - Restricted Access',
    iconClass: [ICON_CLASS_RIGHTS_RESERVED],
    urls: [
      { host: 'www.europeana.eu', path: '/rights/rr-r/' }
    ]
  },
  {
    name: 'Unknown copyright status',
    iconClass: [],
    urls: [
      { host: 'www.europeana.eu', path: '/rights/unknown/' }
    ]
  },
  {
    name: 'In Copyright',
    iconClass: [ICON_CLASS_IN_COPYRIGHT],
    urls: [
      { host: 'rightsstatements.org', path: '/InC/' }
    ]
  },
  {
    name: 'In Copyright - EU Orphan Work',
    iconClass: [ICON_CLASS_IN_COPYRIGHT],
    urls: [
      { host: 'rightsstatements.org', path: '/InC-OW-EU/' }
    ]
  },
  {
    name: 'Copyright Not Evaluated',
    iconClass: [ICON_CLASS_COPYRIGHT_NOT_EVALUATED],
    urls: [
      { host: 'rightsstatements.org', path: '/CNE/' }
    ]
  }
];

export default {
  methods: {
    rightsNameAndIcon(rightsStatementUrl) {
      let rightsStatement;

      try {
        const url = new URL(rightsStatementUrl);
        const match = rightsStatements.find((rs) => rs.urls.some((rsUrl) => {
          return (rsUrl.host === url.host) && (url.pathname.includes(rsUrl.path));
        }));
        if (match) {
          rightsStatement = {
            name: match.name,
            iconClass: match.iconClass
          };
        } else {
          throw new Error('No rights statement found');
        }
      } catch {
        rightsStatement = {
          name: rightsStatementUrl
        };
      }

      return rightsStatement;
    }
  }
};
