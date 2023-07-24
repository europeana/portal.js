import { LokaliseApi } from '@lokalise/node-api';
import stringify from 'json-stable-stringify';
import fs from 'fs';

const lokaliseApi = new LokaliseApi({ apiKey: process.env.LOKALISE_API_TOKEN });

const fetchPage = async(page) => {
  const response = await lokaliseApi.keys().list({
    'project_id': process.env.LOKALISE_PROJECT_ID,
    page,
    limit: 1000,
    'include_translations': 1
  });
  return response.items;
};

const storeTranslation = (i18n, lang, key, translation) => {
  if (!i18n[lang]) {
    i18n[lang] = {};
  }

  const keyParts = key.key_name.other.split('.');

  let target = i18n[lang];

  for (let i = 0; i < keyParts.length; i = i + 1) {
    const keyPart = keyParts[i];
    if (i === (keyParts.length - 1)) {
      target[keyPart] = translation.translation;
    } else {
      if (!target[keyPart]) {
        target[keyPart] = {};
      }
      target = target[keyPart];
    }
  }
};

const run = async() => {
  const i18n = {};
  let items;
  let page = 0;

  while (!Array.isArray(items) || items.length > 0) {
    page = page + 1;
    items = await fetchPage(page);
    for (const key of items) {
      if (!key.tags.includes('Not ready')) {
        for (const translation of key.translations) {
          const lang = translation.language_iso.split('_')[0];

          if (translation.translation !== '') {
            storeTranslation(i18n, lang, key, translation);
          }
        }
      }
    }
  }

  for (const lang in i18n) {
    const langFilename = new URL(`../src/lang/${lang}.json`, import.meta.url);
    console.log(`Writing ${langFilename}`);
    fs.writeFileSync(langFilename, stringify(i18n[lang], { space: 2 }));
  }
};

await run();
