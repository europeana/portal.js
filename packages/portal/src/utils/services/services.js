const portalServices = [
  {
    name: 'europeanaEmbed',
    schemes: [
      'https://embed.europeana.eu/*'
    ],
    purposes: [],
    required: true
  },
  {
    name: 'zoho',
    schemes: [
      'https://forms.zohopublic.eu/*',
      'https://fdti-zcmp.maillist-manage.eu/*'
    ],
    purposes: [],
    required: true
  },
  {
    cookies: ['auth.strategy'],
    name: 'auth-strategy',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: ['debugSettings'],
    name: 'debugSettings',
    purposes: ['essential'],
    required: true
  },
  {
  // https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information
    cookies: [/^_hj/],
    name: 'hotjar',
    purposes: ['usage']
  },
  {
    cookies: ['i18n_locale_code'],
    name: 'i18n',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: [/^_pk_/, 'mtm_cookie_consent'],
    name: 'matomo',
    purposes: ['usage']
  },
  {
    cookies: ['new_feature_notification'],
    name: 'newFeatureNotification',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: ['searchResultsView'],
    name: 'searchResultsView',
    purposes: ['essential'],
    required: true
  }
];

const socialMediaServices = [
  { name: 'googleDocs',
    schemes: [
      'https://docs.google.com/presentation/*'
    ] },
  { name: 'googleDrive',
    schemes: [
      'https://drive.google.com/file/d/*'
    ] },
  { name: 'instagram',
    schemes: [
      '//www.instagram.com/embed.js'
    ] },
  { name: 'pinterest',
    schemes: [
      '//assets.pinterest.com/js/pinit.js'
    ] },
  { name: 'wheeldecide',
    schemes: [
      'https://wheeldecide.com/*'
    ] },
  { name: 'x',
    schemes: [
      'https://platform.twitter.com/widgets.js'
    ] }
].map(service => ({ ...service, purposes: ['socialMedia'] }));

const twoDServices = [
  { name: 'bookWidgets',
    schemes: [
      'https://www.bookwidgets.com/play/*'
    ] },
  { name: 'ecorpus',
    schemes: [
      'https://man.ecorpus.holusion.com/ui/*'
    ] },
  { name: 'gallica',
    schemes: [
      'https://gallica.bnf.fr/*'
    ] },
  { name: 'institutNationalDeLAudiovisuel',
    oembed: 'https://oembed.europeana.eu/',
    schemes: [
      'http://www.ina.fr/video/*',
      'http://www.ina.fr/*/video/*',
      'https://player.ina.fr/player/embed/*'
    ] },
  { name: 'internetCulturale' },
  { name: 'nakala',
    schemes: [
      'https://api.nakala.fr/data'
    ] },
  { name: 'openbeelden' },
  { name: 'serveiDeGestioDocumentalArxius',
    schemes: [
      'https://sgdap.girona.cat/*'
    ] }
].map(service => ({ ...service, purposes: ['2D'] }));

const threeDServices = [
  { name: 'arctur3DViewer',
    schemes: [
      'https://3dviewer.arctur.si/*'
    ] },
  { name: 'theCyprusInstitute',
    schemes: [
      'https://apacwebstorage.hpcf.cyi.ac.cy/threedimensionalmodels/3D/*'
    ] },
  { name: 'eureka3D',
    oembed: 'https://eureka3d.vm.fedcloud.eu/oembed',
    schemes: [
      'https://eureka3d.vm.fedcloud.eu/3d/*'
    ] },
  { name: 'gotlandPictureStones',
    schemes: [
      'https://gotlandicpicturestones.se/*'
    ] },
  { name: 'kompakkt',
    schemes: [
      'https://kompakkt.de/viewer/*'
    ] },
  { name: 'myminifactory',
    schemes: [
      'https://www.myminifactory.com/object/*'
    ] },
  { name: 'sketchfab',
    oembed: 'https://sketchfab.com/oembed',
    schemes: [
      'https://sketchfab.com/3d-models/*',
      'https://sketchfab.com/models/*',
      'https://sketchfab.com/show/*'
    ] },
  { name: 'spatial',
    schemes: [
      'https://www.spatial.io/embed/*'
    ] },
  { name: 'weave',
    oembed: 'https://weave-3dviewer.com/api/core/v1/oembed',
    schemes: [
      'https://weave-3dviewer.com/asset/*'
    ] }
].map(service => ({ ...service, purposes: ['3D'] }));

const audioServices = [
  { name: 'britishLibrarySounds',
    schemes: [
      'http://sounds.bl.uk/embed/*',
      'https://sounds.bl.uk/*'
    ] },
  { name: 'buzzsprout',
    schemes: [
      'https://www.buzzsprout.com/*'
    ] },
  { name: 'deutscheWelle',
    schemes: [
      'https://www.dw.com/*',
      'https://radiodownloaddw-a.akamaihd.net/*'
    ] },
  { name: 'freesound',
    schemes: [
      'https://freesound.org/embed/sound/iframe/*'
    ] },
  { name: 'phonobase' },
  { name: 'soundArchivesOfTheCNRS',
    oembed: 'https://oembed.europeana.eu/',
    schemes: [
      'http://archives.crem-cnrs.fr/archives/items/*/'
    ] },
  { name: 'soundCloud',
    oembed: 'https://soundcloud.com/oembed',
    schemes: [
      'http://soundcloud.com/*',
      'https://soundcloud.com/*',
      'https://w.soundcloud.com/player/*'
    ] }
].map(service => ({ ...service, purposes: ['audio'] }));

const multimediaServices = [
  { name: 'archiveOrg',
    schemes: [
      'https://archive.org/embed/*'
    ] },
  { name: 'digitalRepositoryOfIreland',
    schemes: [
      'https://repository.dri.ie/objects/*'
    ] }
].map(service => ({ ...service, purposes: ['multimedia'] }));

const videoServices = [
  { name: 'deutschesFilmportal',
    schemes: [
      'http://www.filmportal.de/video/*'
    ] },
  { name: 'eclap',
    schemes: [
      'http://www.eclap.eu/*'
    ] },
  { name: 'europeanParliamentMultimediaService',
    schemes: [
      'https://multimedia.europarl.europa.eu/*'
    ] },
  { name: 'euscreen',
    oembed: 'https://oembed.euscreen.eu/services/oembed',
    schemes: [
      'http://www.euscreen.eu/item.html*',
      'https://www.euscreen.eu/item.html*',
      'https://euscreen.orf.at/content/*',
      'https://embd.eu/*'
    ] },
  { name: 'tibAvPortal',
    schemes: [
      'http://av.tib.eu/player/*'
    ] },
  { name: 'tv3',
    oembed: 'https://oembed.europeana.eu/',
    schemes: [
      'http://www.ccma.cat/tv3/alacarta/programa/titol/video/*/',
      'https://mp4-down-high-int.ccma.cat/*'
    ] },
  { name: 'vimeo',
    oembed: 'https://vimeo.com/api/oembed.json',
    schemes: [
      'https://vimeo.com/*',
      'https://vimeo.com/album/*/video/*',
      'https://vimeo.com/channels/*/*',
      'https://vimeo.com/groups/*/videos/*',
      'https://vimeo.com/ondemand/*/*',
      'https://player.vimeo.com/video/*',
      'http://vimeo.com/*',
      'http://vimeo.com/album/*/video/*',
      'http://vimeo.com/channels/*/*',
      'http://vimeo.com/groups/*/videos/*',
      'http://vimeo.com/ondemand/*/*',
      'http://player.vimeo.com/video/*'
    ] },
  { name: 'youTube',
    oembed: 'https://www.youtube.com/oembed',
    schemes: [
      'http://www.youtube.com/embed/*',
      'https://youtube.com/watch*',
      'https://youtube.com/v/*',
      'https://www.youtube.com/watch*',
      'https://www.youtube.com/v/*',
      'https://www.youtube.com/embed/*',
      'https://youtube.com/embed/*',
      'https://youtu.be/*'
    ] }
].map(service => ({ ...service, purposes: ['video'] }));

const mediaViewingServices = twoDServices.concat(threeDServices, audioServices, multimediaServices, videoServices)
  .map(service => ({ ...service, purposes: ['mediaViewing', ...service.purposes] }));

const otherEmbeddingServices = [
  { name: 'albinLarsson',
    schemes: ['https://byabbe.se/*'] },
  { name: 'behance',
    schemes: [
      'https://www.behance.net/embed/*'
    ] },
  { name: 'codepen',
    schemes: [
      'https://codepen.io/*/embed/*'
    ] },
  { name: 'datawrapper',
    schemes: [
      'http://datawrapper.dwcdn.net/*'
    ] },
  { name: 'giphy',
    schemes: [
      'http://giphy.com/embed/*',
      'https://giphy.com/embed/*'
    ] },
  { name: 'humap',
    schemes: [
      'https://*.humap.site/*'
    ] },
  { name: 'jigsawplanet',
    schemes: [
      'https://www.jigsawplanet.com/?rc=play&pid=*'
    ] },
  { name: 'kystreise',
    schemes: [
      'https://rs.kystreise.no/filestore/*'
    ] },
  { name: 'myAdventCalendar',
    schemes: [
      'https://app.myadvent.net/calendar?id=*',
      'https://calendar.myadvent.net/?id=*'
    ] },
  { name: 'prezi',
    schemes: [
      'https://prezi.com/embed/*'
    ] },
  { name: 'slidebean',
    schemes: [
      'http://slidebean.com/embed/*'
    ] },
  { name: 'universityOfCaliforniaSanDiego',
    schemes: [
      'https://pointcloud.ucsd.edu/*'
    ] },
  { name: 'wikidata',
    schemes: [
      'https://query.wikidata.org/*'
    ] },
  { name: 'woobox',
    schemes: [
      'https://woobox.com/js/plugins/woo.js'
    ] }
].map(service => ({ ...service, purposes: ['other'] }));

const thirdPartyServices = [...socialMediaServices, ...mediaViewingServices, ...otherEmbeddingServices]
  .map(service => ({ ...service, purposes: ['thirdPartyContent', ...service.purposes] }));

export default portalServices.concat(thirdPartyServices);
