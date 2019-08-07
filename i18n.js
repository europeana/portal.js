import I18n from 'react-native-i18n';

import en from './lang/en.js'
import nl from './lang/nl.js'
import de from './lang/de.js'

I18n.fallbacks = true;

I18n.translations = {
    en,
    nl,
    de
};

export default I18n;
