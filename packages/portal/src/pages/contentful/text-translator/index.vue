<template>
  <div class="contentful">
    <b-form-group>
      <b-button
        class="mb-2"
        @click="translateText"
      >
        Translate
      </b-button>
    </b-form-group>
    <table
      v-if="targetLanguages.length > 0"
    >
      <thead>
        <tr>
          <th>Locale</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(target, index) in targetLanguages"
          :key="index"
        >
          <td>{{ target.locale }}</td>
          <td>
            <template
              v-if="target.service"
            >
              OK
            </template>
            <template
              v-else-if="target.error"
            >
              {{ target.error }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import TurndownService from 'turndown';

  import parseMarkdown from "@/utils/markdown/parse.js";
  import contentfulSidebarMixin from '@/mixins/contentful/sidebar';

  export default {
    name: 'ContentfulEntityHarvesterPage',

    mixins: [
      contentfulSidebarMixin
    ],

    layout: 'contentful',

    data() {
      return {
        targetLanguages: []
      };
    },

    head() {
      return {
        title: 'Text translator - Contentful app',
        bodyAttrs: {
          class: '',
          style: 'background: transparent;'
        }
      };
    },

    methods: {
      async translateText() {
        // console.log('entry', this.entry.fields)
        // return;
        // for (const fieldId in this.entry.fields) {
        //   const field = this.entry.fields[fieldId];
        //   console.log(fieldId, field, field.getValue())
        // }

        // FIXME: endpoint does not support CORS requests
        // const infoResponse = await this.$apis.translation.info();
        // const supportedTargetLanguages = infoResponse.config.translate.supported.target;
        const supportedTargetLanguages = [
          'bg',
          'cs',
          'da',
          'de',
          'el',
          'en',
          'es',
          'et',
          'fi',
          'fr',
          'ga',
          'hr',
          'hu',
          'it',
          'lt',
          'lv',
          'nl',
          'pl',
          'pt',
          'ro',
          'sk',
          'sl',
          'sv'
        ];
        const turndownService = new TurndownService();

        const fieldsToTranslate = [];
        const textsToTranslate = [];
        this.targetLanguages = [];

        for (const fieldId in this.entry.fields) {
          const field = this.entry.fields[fieldId];
          // TODO: handle arrays of text?
          if (['Symbol', 'Text'].includes(field.type) && field.locales.length > 1) {
            let fieldEnglishValue;

            for (const locale of field.locales) {
              const lang = locale.split('-').shift();
              if (locale === 'en-GB') {
                fieldEnglishValue = field.getValue('en-GB');
                if (field.type === 'Text') {
                  fieldEnglishValue = parseMarkdown(fieldEnglishValue);
                }
              } else if (!this.targetLanguages.find((target) => target.lang === lang)) {
                if (supportedTargetLanguages.includes(lang)) {
                  this.targetLanguages.push({ locale, lang, service: undefined, error: undefined });
                } else {
                  console.warn(`Target language not supported by API: ${lang}`);
                }
              }
            }

            if (fieldEnglishValue) {
              fieldsToTranslate.push(field);
              textsToTranslate.push(fieldEnglishValue);
            }
          }
        }

        console.log('targetLanguages', this.targetLanguages);
        console.log('fieldsToTranslate', fieldsToTranslate);
        console.log('textsToTranslate', textsToTranslate);

        if (textsToTranslate.length > 0) {
          for (const target of this.targetLanguages) {
            try {
              const data = {
                source: 'en',
                target: target.lang,
                text: textsToTranslate
              };
              console.log(data);
              const apiResponse = await this.$apis.translation.translate(data);
              console.log('api response', apiResponse);
              for (let i = 0; i < fieldsToTranslate.length; i = i + 1) {
                const field = fieldsToTranslate[i];
                // TODO: truncate translation if needed
                let fieldTranslatedValue = apiResponse.translations[i];

                if (field.type === 'Text') {
                  fieldTranslatedValue = turndownService.turndown(fieldTranslatedValue);
                }
                this.entry.fields[field.id].setValue(fieldTranslatedValue, target.locale);
              }
              target.service = apiResponse.service;
            } catch (e) {
              // TODO: use a CTF method for this? or list errors on screen
              target.error = e;
            }
            console.log('target', target);
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .contentful {
    button {
      margin-right: 1rem;
    }

    font-size: 11px;
  }
</style>
