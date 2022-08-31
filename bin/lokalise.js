import { LokaliseApi } from '@lokalise/node-api';
import fs from 'fs';
import path from 'path';

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

const stringify = (thing, root = false, indent = 0) => {
  let str = '';
  if (root) {
    str = str + 'export default ';
  }

  if (typeof thing === 'string') {
    const quoted = thing.replace(/"/g, '\\"');
    str = str + `"${quoted}"`;
  } else {
    str = str + '{\n';
    const sorted = Object.keys(thing).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'variant', caseFirst: 'upper' }));
    for (const key of sorted) {
      str = str + ' '.repeat(indent + 2) + `"${key}": `;
      str = str + stringify(thing[key], false, indent + 2);
      if (key !== sorted[sorted.length - 1]) {
        str = str + ',';
      }
      str = str + '\n';
    }
    str = str + ' '.repeat(indent) + '}';
  }

  if (root) {
    str = str + ';\n';
  }

  return str;
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
        const keyParts = key.key_name.other.split('.');
        for (const translation of key.translations) {
          const lang = translation.language_iso.split('_')[0];
          if ((lang !== 'en') && (translation.translation !== '')) {
            if (!i18n[lang]) {
              i18n[lang] = {};
            }

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
          }
        }
      }
    }
  }

  for (const lang in i18n) {
    const langFilename = new URL(`../src/lang/${lang}.js`, import.meta.url);
    console.log(`Writing ${langFilename}`);
    fs.writeFileSync(langFilename, stringify(i18n[lang], true));
  }
};

run();
