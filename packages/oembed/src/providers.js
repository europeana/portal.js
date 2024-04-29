export default [
  {
    name: 'EUreka3D',
    endpoint: 'https://eureka3d.vm.fedcloud.eu/oembed',
    schemes: [
      'https://eureka3d.vm.fedcloud.eu/3d/*'
    ]
  },
  {
    name: 'Europeana',
    endpoint: 'https://oembed.europeana.eu/',
    schemes: [
      'http://archives.crem-cnrs.fr/archives/items/*/',
      'http://www.ccma.cat/tv3/alacarta/programa/titol/video/*/',
      'http://www.ina.fr/video/*',
      'http://www.ina.fr/*/video/*'
    ]
  },
  {
    name: 'EUscreen',
    endpoint: 'https://oembed.euscreen.eu/services/oembed',
    schemes: ['http://www.euscreen.eu/item.html*']
  },
  {
    name: 'SoundCloud',
    endpoint: 'https://soundcloud.com/oembed',
    schemes: ['http://soundcloud.com/*', 'https://soundcloud.com/*']
  },
  {
    name: 'Vimeo',
    endpoint: 'https://vimeo.com/api/oembed.json',
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
    ]
  },
  {
    name: 'Sketchfab',
    endpoint: 'https://sketchfab.com/oembed',
    schemes: [
      'https://sketchfab.com/3d-models/*',
      'https://sketchfab.com/models/*',
      'https://sketchfab.com/show/*'
    ]
  },
  {
    name: 'WEAVE',
    endpoint: 'https://weave-3dviewer.com/api/core/v1/oembed',
    schemes: [
      'https://weave-3dviewer.com/asset/*'
    ]
  },
  {
    name: 'YouTube',
    endpoint: 'https://www.youtube.com/oembed',
    schemes: [
      'https://youtube.com/watch*',
      'https://youtube.com/v/*',
      'https://www.youtube.com/watch*',
      'https://www.youtube.com/v/*',
      'https://youtu.be/*'
    ]
  }
];
