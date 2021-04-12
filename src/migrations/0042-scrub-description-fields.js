require('dotenv').config();

const contentful = require('contentful-management');

const client = contentful.createClient({
  accessToken: process.env.CTF_CMA_ACCESS_TOKEN
});

const scrubBeforeDate = new Date('2 March 2021');

client.getSpace(process.env.CTF_SPACE_ID)
  .then((space) => space.getEnvironment(process.env.CTF_ENVIRONMENT_ID))
  // instead of the forEach we might be able to insert a query
  // as parameter to getAssets to filter the assets
  .then((environment) => environment.getAssets({
    limit: 1000,
    'sys.createdAt[lt]': scrubBeforeDate,
    'fields.description[exists]': true
  }))
  .then((response) => {
    response.items.forEach(asset => {
      asset.fields.description = undefined;
      asset.update();
      if (!!asset.sys.publishedVersion &&
    asset.sys.version === asset.sys.publishedVersion + 1) {
        asset.publish();
      }
      console.log(`Asset ${asset.sys.id} updated.`);
    });
  })
  .catch(console.error);
