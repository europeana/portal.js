export const langAttribute = (lang, locale) => {
  return (lang === locale) ? null : lang;
};
