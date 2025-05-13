import camelCase from 'lodash/camelCase.js';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

const MODULE_NAME = 'contentful-graphql';

const graphqlPaths = glob.sync(path.resolve(__dirname, './queries/*.graphql'));

// TODO: start using graphql-tag pkg to support importing of .graphql files
const graphqlQueries = graphqlPaths.reduce((memo, graphqlPath) => {
  const basename = path.basename(graphqlPath, '.graphql');
  const alias = camelCase(basename);
  memo[alias] = fs.readFileSync(graphqlPath, 'utf8');
  return memo;
}, {});

module.exports = function() {
  for (const template of ['queries.ejs', 'query.js']) {
    this.addTemplate({
      src: path.resolve(__dirname, path.join('templates', template)),
      fileName: path.join(MODULE_NAME, template.replace('.ejs', '.js')),
      options: graphqlQueries
    });
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: path.join(MODULE_NAME, 'plugin.js')
  });
};
