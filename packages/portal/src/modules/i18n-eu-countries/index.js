import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';

export const LANGUAGES = [
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'et',
  'eu',
  'fi',
  'fr',
  'ga',
  'hr',
  'hu',
  'it',
  'lt',
  'lv',
  'mt',
  'nl',
  'pl',
  'pt',
  'ro',
  'sk',
  'sl',
  'sv'
];

export default function() {
  const { nuxt } = this;

  nuxt.hook('i18n:extend-messages', async(messages) => {
    const countryMessages = {};
    for (const lang of LANGUAGES) {
      const langData = await readFileSync(fileURLToPath(new URL(`./lang/${lang}.json`, import.meta.url)));
      countryMessages[lang] = { 'eu-countries': JSON.parse(langData) };
    }

    messages.push(countryMessages);
  });
}
