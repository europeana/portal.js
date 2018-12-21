import { storiesOf } from '@storybook/vue';

import MultiLineEllipsis from './MultiLineEllipsis.vue';

const clssMulti = 'level';
const mleText   = 'This text is';
const mleTextX  = '<span class="' + clssMulti + ' a">This text is </span><a class="' + clssMulti + ' b" href="www.europeana.eu">too long</a><span class="' + clssMulti + ' c"> to fit in its </span><b class="' + clssMulti + ' d">container</b><span class="' + clssMulti + ' e"> and so should display with ellipsis, indicating to the user that there is more to be seen rather than terminating abruptly at a random point.</span>';
const attrStyle = 'background-color: #ececec; max-width: 20em; padding: 0.5em;';
const styleL2   = ' line-height: 1.8em; max-height: 4.6em;';
const styleL3   = ' line-height: 1.8em; max-height: 6.4em;';
const styleL4   = ' line-height: 1.8em; max-height: 8.2em;';

const elIcon    = '<span class="svg-icon-external-eu-blue"></span>';
const openLink  = '<a href="www.europeana.eu">';
const closeLink = '</a>';

storiesOf('MultiLineEllipsis', module)
  .add('2-lines: simple text', () => ({
    components: { MultiLineEllipsis },
    template: '<MultiLineEllipsis style="' + attrStyle + styleL2 + '">' + mleText + '</MultiLineEllipsis>'
  }))
  .add('2-lines: text in a link', () => ({
    components: { MultiLineEllipsis },
    template: '<MultiLineEllipsis style="' + attrStyle + styleL2 + '">' + openLink + mleText + closeLink + '</MultiLineEllipsis>'
  }))
  .add('3-lines: text in a link with icon', () => ({
    components: { MultiLineEllipsis },
    template: '<MultiLineEllipsis style="' + attrStyle + styleL3 + '">' + openLink + mleText + elIcon + closeLink + '</MultiLineEllipsis>',
  }))
  .add('4-lines: multi node', () => ({
    components: { MultiLineEllipsis },
    template: '<MultiLineEllipsis :ops="ops" style="' + attrStyle + styleL4 + '">' + mleTextX + elIcon + '</MultiLineEllipsis>',
    data() {
      return { ops: { multiNode: '.' + clssMulti } };
    }
  }));
