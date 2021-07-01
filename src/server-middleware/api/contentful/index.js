import contentfulPlugin from '../../../plugins/contentful-graphql/plugin.server';
import { errorHandler } from '../';

export default ($config) => (req, res) => {
  return contentfulPlugin({ $config })
    .query(req.params.alias, JSON.parse(req.query.variables))
    .then(response => {
      res.send(response.data);
    })
    .catch(error => errorHandler(res, error));
};
