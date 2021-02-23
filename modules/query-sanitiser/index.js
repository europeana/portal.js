import path from 'path';

const MODULE_NAME = 'query-sanitiser';

const templates = ['sanitise.js', 'middleware.plugin.js', 'store.plugin.js'];

export default function() {
  for (const template of templates) {
    (template.endsWith('.plugin.js') ? this.addPlugin : this.addTemplate)({
      src: path.resolve(__dirname, path.join('templates', template)),
      fileName: path.join(MODULE_NAME, template)
    });
  }
}
