export default [
  {
    name: 'Europeana',
    endpoint: 'https://oembed.europeana.eu/',
    schemes: [
      'http://archives.crem-cnrs.fr/archives/items/*/',
      'http://www.ccma.cat/tv3/alacarta/programa/titol/video/*/',
      'http://www.ina.fr/video/*',
      'http://www.ina.fr/*/video/*',
      'http://api.picturepipe.net/api/html/widgets/public/playout_cloudfront?token=*',
      'https://api.picturepipe.net/api/html/widgets/public/playout_cloudfront?token=*',
      'http://www.theeuropeanlibrary.org/tel4/newspapers/issue/fullscreen/*'
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
      'https://sketchfab.com/models/*',
      'https://sketchfab.com/show/*'
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
