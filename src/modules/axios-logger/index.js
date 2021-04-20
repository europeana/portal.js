import path from 'path';

const MODULE_NAME = 'axiosLogger';

const templates = ['store.js'];
const plugins = ['plugin.js'];

export default function() {
  for (const template of templates) {
    this.addTemplate({
      src: path.resolve(__dirname, path.join('templates', template)),
      fileName: path.join(MODULE_NAME, template.replace('.ejs', '.js'))
    });
  }

  for (const plugin of plugins) {
    this.addPlugin({
      src: path.resolve(__dirname, path.join('templates', plugin)),
      fileName: path.join(MODULE_NAME, plugin)
    });
  }
}
