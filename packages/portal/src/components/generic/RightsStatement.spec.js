import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import RightsStatement from '@/components/generic/RightsStatement.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(RightsStatement, {
  localVue,
  propsData
});

const statements = [
  { label: 'CC BY-NC-ND', urls: ['http://creativecommons.org/licenses/by-nc-nd/4.0/'], classes: ['cc', 'by', 'nc', 'nd'] },
  { label: 'CC BY-NC-SA', urls: ['http://creativecommons.org/licenses/by-nc-sa/4.0/'], classes: ['cc', 'by', 'nc', 'sa'] },
  { label: 'CC BY-NC', urls: ['http://creativecommons.org/licenses/by-nc/4.0/'], classes: ['cc', 'by', 'nc'] },
  { label: 'CC BY-ND', urls: ['http://creativecommons.org/licenses/by-nd/4.0/'], classes: ['cc', 'by', 'nd'] },
  { label: 'CC BY-SA', urls: ['http://creativecommons.org/licenses/by-sa/4.0/'], classes: ['cc', 'by', 'sa'] },
  { label: 'CC BY', urls: ['http://creativecommons.org/licenses/by/4.0/'], classes: ['cc', 'by'] },
  { label: 'CC0', urls: ['http://creativecommons.org/publicdomain/zero/1.0/'], classes: ['zero'] },
  { label: 'Copyright Not Evaluated', urls: ['Copyright Not Evaluated'], classes: [] },
  { label: 'Copyright Not Evaluated', urls: ['http://rightsstatements.org/page/CNE/1.0/', 'http://rightsstatements.org/vocab/CNE/1.0/'], classes: ['rs-unknown'] },
  { label: 'In Copyright - Educational Use Permitted', urls: ['http://rightsstatements.org/page/InC-EDU/1.0/', 'http://rightsstatements.org/vocab/InC-EDU/1.0/'], classes: ['rs-yes'] },
  { label: 'In Copyright - EU Orphan Work', urls: ['http://rightsstatements.org/page/InC-OW-EU/1.0/', 'http://rightsstatements.org/vocab/InC-OW-EU/1.0/'], classes: ['rs-yes'] },
  { label: 'In Copyright', urls: ['http://rightsstatements.org/page/InC/1.0/', 'http://rightsstatements.org/vocab/InC/1.0/'], classes: ['rs-yes'] },
  { label: 'No Copyright - Non-Commercial Use Only', urls: ['http://rightsstatements.org/page/NoC-NC/1.0/', 'http://rightsstatements.org/vocab/NoC-NC/1.0/'], classes: ['rs-no'] },
  { label: 'No Copyright - Non-Commercial Use Only', urls: ['http://www.europeana.eu/rights/out-of-copyright-non-commercial/'], classes: ['rs-no'] },
  { label: 'No Copyright - Other Known Legal Restrictions', urls: ['http://rightsstatements.org/page/NoC-OKLR/1.0/', 'http://rightsstatements.org/vocab/NoC-OKLR/1.0/'], classes: ['rs-no'] },
  { label: 'Public Domain', urls: ['http://creativecommons.org/publicdomain/mark/1.0/', 'http://creativecommons.org/licenses/publicdomain/mark/'], classes: ['pd'] },
  { label: 'Rights Reserved - Free Access', urls: ['http://www.europeana.eu/rights/rr-f/'], classes: ['rr'] },
  { label: 'Rights Reserved - Paid Access', urls: ['http://www.europeana.eu/rights/rr-p/'], classes: ['rr'] },
  { label: 'Rights Reserved - Restricted Access', urls: ['http://www.europeana.eu/rights/rr-r/'], classes: ['rr'] },
  { label: 'Unknown copyright status', urls: ['http://www.europeana.eu/rights/unknown/'], classes: [] },
  { label: 'Not a URL', urls: ['Not a URL'], classes: [] },
  { label: 'https://example.org/', urls: ['https://example.org/'], classes: [] }
];

describe('components/generic/RightsStatement', () => {
  for (const statement of statements) {
    for (const url of statement.urls) {
      describe(`when URL is ${url}`, () => {
        it(`is labelled "${statement.label}"`, () => {
          const wrapper = factory({ rightsStatementUrl: url });

          const rights = wrapper.find('[data-qa="rights statement"]');
          expect(rights.text()).toBe(statement.label);
        });

        const iconCount = statement.classes.length;
        it(`has ${iconCount} icon(s)`, () => {
          const wrapper = factory({ rightsStatementUrl: url });

          const icons = wrapper.findAll('[data-qa="rights statement"] .license');
          expect(icons.length).toBe(iconCount);
        });

        for (const iconClassSuffix of statement.classes) {
          const iconClass = `icon-license-${iconClassSuffix}`;
          it(`has an icon with class "${iconClass}"`, () => {
            const wrapper = factory({ rightsStatementUrl: url });

            const icon = wrapper.find(`[data-qa="rights statement"] .${iconClass}`);
            expect(icon.isVisible()).toBe(true);
          });
        }
      });
    }
  }
});
