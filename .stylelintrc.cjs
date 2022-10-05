module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue'
  ],
  rules: {
    'at-rule-no-unknown': null,
    'block-closing-brace-newline-after': 'always',
    'block-opening-brace-space-before': 'always',
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-colon-space-after': 'always-single-line',
    'function-comma-space-after': 'always-single-line',
    'function-url-quotes': 'always',
    'indentation': 2,
    'no-missing-end-of-source-newline': true,
    'number-leading-zero': 'always',
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],
    'string-quotes': 'single',
    'value-no-vendor-prefix': [
      true,
      { ignoreValues: ['box'] }
    ]
  }
}
