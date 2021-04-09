require('dotenv').config();

const contentful = require('contentful-management');

const client = contentful.createClient({
  accessToken: process.env.CTF_CMA_ACCESS_TOKEN
});

client.getSpace(process.env.CTF_SPACE_ID)
  .then((space) => space.getEnvironment(process.env.CTF_ENVIRONMENT_ID))
  // instead of the forEach we might be able to insert a query
  // as parameter to getAssets to filter the assets
  .then((environment) => environment.getAssets({ limit: 1000 }))
  .then((response) => {
    response.items.forEach(asset => {
      const createdAt = new Date(asset.sys.createdAt);
      const scrubBeforeDate = new Date('2 March 2021');
      if (createdAt < scrubBeforeDate && asset.fields.description) {
        asset.fields.description = undefined;
        asset.update();
        asset.publish();
        console.log(`Asset ${asset.sys.id} updated.`);
      }
    });
  })

  .catch(console.error);
