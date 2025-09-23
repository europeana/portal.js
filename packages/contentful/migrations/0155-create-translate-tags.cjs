const languages = [
  { code: 'bg-BG', label: 'Bulgarian' },
  { code: 'cs-CZ', label: 'Czech' },
  { code: 'da-DK', label: 'Danish' },
  { code: 'de-DE', label: 'German' },
  { code: 'el-GR', label: 'Greek' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'et-EE', label: 'Estonian' },
  { code: 'fi-FI', label: 'Finnish' },
  { code: 'fr-FR', label: 'French' },
  { code: 'ga-IE', label: 'Irish' },
  { code: 'hr-HR', label: 'Croatian' },
  { code: 'hu-HU', label: 'Hungarian' },
  { code: 'it-IT', label: 'Italian' },
  { code: 'lt-LT', label: 'Lithuanian' },
  { code: 'lv-LV', label: 'Latvian' },
  { code: 'mt-MT', label: 'Maltese' },
  { code: 'nl-NL', label: 'Dutch' },
  { code: 'pl-PL', label: 'Polish' },
  { code: 'pt-PT', label: 'Portuguese' },
  { code: 'ro-RO', label: 'Romanian' },
  { code: 'sk-SK', label: 'Slovak' },
  { code: 'sl-SI', label: 'Slovenian' },
  { code: 'sv-SE', label: 'Swedish' }
];

module.exports = function(migration) {
  for (const lang of languages) {
    const id = `translate.${lang.code}`;
    const name = `Translate: ${lang.label} (${lang.code})`;
    const visibility = 'private';

    migration.createTag(id, { name }, visibility);
  }
};
