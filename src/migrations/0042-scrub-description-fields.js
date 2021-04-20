require('dotenv').config();

const contentful = require('contentful-management');

const client = contentful.createClient({
  accessToken: process.env.CTF_CMA_ACCESS_TOKEN
});

const scrubBeforeDate = new Date('2 March 2021');

async function scrubDescriptionField(assets) {
  assets.forEach(async assetToScrub => {
    let asset = assetToScrub;
    const assetPublished = !!asset.sys.publishedVersion &&
    asset.sys.version === asset.sys.publishedVersion + 1;
    asset.fields.description = undefined;
    try {
      asset = await asset.update();
      if (assetPublished) {
        await asset.publish();
      }
      console.log(`Asset ${asset.sys.id} updated.`);
    } catch (error) {
      console.error;
    }
  });
}

client.getSpace(process.env.CTF_SPACE_ID)
  .then((space) => space.getEnvironment(process.env.CTF_ENVIRONMENT_ID))
  .then((environment) => environment.getAssets({
    limit: 1000,
    'sys.createdAt[lt]': scrubBeforeDate,
    'fields.description[exists]': true
  }))
  .then((response) => {
    scrubDescriptionField(response.items);
  })
  .catch(console.error);
