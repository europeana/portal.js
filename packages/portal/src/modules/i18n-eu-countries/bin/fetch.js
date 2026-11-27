import { fileURLToPath, URL } from 'node:url';
import { writeFileSync } from 'node:fs';

import { LANGUAGES } from '../index.js';

const endpoint = 'https://publications.europa.eu/webapi/rdf/sparql';

const selectVars = LANGUAGES.map(lang => `?${lang}`).join(' ');
const optionalBlocks = LANGUAGES
  .map(
    (lang) =>
      `OPTIONAL { ?country_uri skos:prefLabel ?l_${lang} . FILTER(lang(?l_${lang}) = "${lang}") BIND(str(?l_${lang}) AS ?${lang}) }`
  )
  .join('\n    ');

const sparqlQuery = `
PREFIX euvoc: <http://publications.europa.eu/ontology/euvoc#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT (?country_uri AS ?id) ${selectVars}
FROM <http://publications.europa.eu/resource/authority/country>
WHERE {
    ?country_uri a skos:Concept .

    # Keep only top-level entities (excludes dependent/overseas territories & marine/disputed zones)
    ?country_uri skos:topConceptOf <http://publications.europa.eu/resource/authority/country> .

    # Keep only standard 3-letter codes not starting with X (excludes XDST, XMAZ, XUCT, XKX, 1A0, OP_DATPRO)
    FILTER(REGEX(STR(?country_uri), "/country/[A-WY-Z][A-Z]{2}$"))

    # Exclude historical and deprecated entities
    FILTER NOT EXISTS { ?country_uri euvoc:endDate ?endDate }

    ${optionalBlocks}
}
ORDER BY ?en
`;

async function fetchCountries() {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/sparql-results+json'
    },
    body: new URLSearchParams({
      'default-graph-uri': '',
      'format': 'application/sparql-results+json',
      'timeout': '0',
      'debug': 'on',
      'query': sparqlQuery
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SPARQL request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  const countries = data.results.bindings.map((row) => {
    const entry = { id: row.id.value };
    entry.code = entry.id.split('/').pop();
    for (const lang of LANGUAGES) {
      entry[lang] = row[lang]?.value ?? null;
    }
    return entry;
  }).sort((a, b) => a.code.localeCompare(b.code));

  return countries;
}

async function writeLangFiles(countries) {
  const langData = LANGUAGES.reduce((memo, lang) => {
    memo[lang] = {};

    for (const country of countries) {
      if (country[lang]) {
        memo[lang][country.code] = country[lang];
      }
    }

    return memo;
  }, {});

  for (const lang of LANGUAGES) {
    const langFile = fileURLToPath(new URL(`../lang/${lang}.json`, import.meta.url));

    await writeFileSync(langFile, JSON.stringify(langData[lang], null, 2));
  }
}

async function run() {
  const countries = await fetchCountries();
  await writeLangFiles(countries);
}

run().catch(console.error);
