import I18n from 'react-native-i18n';

import nl from './lang/nl.js'
import en from './lang/en.js'
import de from './lang/de.js'
import es from './lang/es.js'

I18n.fallbacks = true;

I18n.translations = {
    nl,
    en,
    de,
    es
};

export default I18n;
