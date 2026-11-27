import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';

import { codes as langCodes } from '@europeana/i18n';

export default function() {
  const { nuxt } = this;

  nuxt.hook('i18n:extend-messages', async(messages) => {
    const countryMessages = {};
    for (const lang of langCodes) {
      const langData = await readFileSync(fileURLToPath(new URL(`./lang/${lang}.json`, import.meta.url)));
      countryMessages[lang] = JSON.parse(langData);
    }

    const countryMessagesByEnglishLabel = {};
    for (const lang of langCodes) {
      countryMessagesByEnglishLabel[lang] = { countries: {} };
      for (const countryCode in countryMessages.en) {
        const englishLabel = countryMessages.en[countryCode];
        countryMessagesByEnglishLabel[lang].countries[englishLabel] = countryMessages[lang][countryCode];
      }
    }

    messages.push(countryMessagesByEnglishLabel);
  });
}
