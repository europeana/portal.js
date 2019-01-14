import { storiesOf } from '@storybook/vue';

import EuropeanaCollectionsLogo from './EuropeanaCollectionsLogo.vue';

storiesOf('EuropeanaCollectionsLogo', module)
  .add('logo', () => ({
    components: { EuropeanaCollectionsLogo },
    template:  '<EuropeanaCollectionsLogo />'
 }));
