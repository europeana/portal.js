//import EuropeanaMediaPlayer from 'europeana-media-player';
//import EuropeanaMediaPlayer from './components/europeana-media-player';

console.log('in ../plugins/europeana-media-player.js');
//import EuropeanaMediaPlayer from '../node_modules/europeana-media-player/src/components/europeanamediaplayer';
import EuropeanaMediaPlayer from 'europeanamediaplayer';
console.log('loaded EuropeanaMediaPlayer');
//
// const videoObj = {
//   source: 'https://videoeditor.noterik.com/manifest/05_synchronised_av_text.json',
//   duration: 120,
//   id: '05_synchronized_av_test.json'
// };
// const container = document.find('playerElement');
//
// function createPlayer () {
//   console.log('aboot to init player');
//   return new EuropeanaMediaPlayer(container, videoObj);
// }

export default (ctx, inject) => {
  inject('$EuropeanaMediaPlayer', EuropeanaMediaPlayer);
};
