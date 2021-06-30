import I18n from 'react-native-i18n';

import en from './src/lang/en.js'
import eu from './src/lang/eu.js'
import bg from './src/lang/bg.js'
import hr from './src/lang/hr.js'
import cs from './src/lang/cs.js'
import da from './src/lang/da.js'
import nl from './src/lang/nl.js'
import et from './src/lang/et.js'
import fi from './src/lang/fi.js'
import fr from './src/lang/fr.js'
import de from './src/lang/de.js'

I18n.fallbacks = true;

I18n.translations = {
    en,
    eu,
    bg,
    hr,
    cs,
    da,
    nl,
    et,
    fi,
    fr,
    de
};

export default I18n;
