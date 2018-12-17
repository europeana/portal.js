import { storiesOf } from '@storybook/vue';

import LoadingImage from './LoadingImage.vue';

const style = 'style="height: 150px; width: 200px;"';

storiesOf('LoadingImage', module)
  .add('loading', () => ({
    components: { LoadingImage },
    template:  '<LoadingImage ' + style + ' url="www.europeana.eu"/>'
  }))
  .add('loaded', () => ({
    components: { LoadingImage },
    template:  '<LoadingImage thumbnail="/img/storybook/card-img-1.jpg" url="www.europeana.eu" ' + style + '/>'
  }));
