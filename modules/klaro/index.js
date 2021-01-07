import path from 'path';
process.client ? import('klaro/dist/klaro-no-css') : null;

const MODULE_NAME = 'klaro';

export default function() {
  // this.addPlugin({
  //   src: path.resolve(__dirname, 'plugin.js'),
  //   fileName: path.join(MODULE_NAME, 'plugin.js')
  // });
}