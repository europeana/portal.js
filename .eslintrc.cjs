module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022
  },
  rules: {
    'array-bracket-newline': ['error', 'consistent'],
    'array-bracket-spacing': ['error', 'never'],
    'array-element-newline': ['error', 'consistent'],
    'arrow-spacing': 'error',
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    camelcase: ['error', { ignoreDestructuring: false }],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    curly: 'error',
    'eol-last': ['error', 'always'],
    eqeqeq: ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'function-call-argument-newline': ['error', 'consistent'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'jest/expect-expect': 'error',
    'jest/prefer-expect-assertions': 0,
    'jest/no-conditional-expect': 1,
    'jsx-quotes': ['error', 'prefer-double'],
    'key-spacing': ['error', { afterColon: true }],
    'keyword-spacing': ['error', { before: true, after: true }],
    'linebreak-style': ['error', 'unix'],
    // Disabled pending manual resolution of violations
    // 'max-len': ['error', { code: 120 }],
    'no-array-constructor': 'error',
    'no-bitwise': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-lonely-if': 'error',
    'no-mixed-operators': 'error',
    'no-multi-assign': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-negated-condition': 'error',
    'no-nested-ternary': 'error',
    'no-new-object': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-underscore-dangle': 'error',
    'no-unneeded-ternary': 'error',
    'no-var': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': ['error', 'beside'],
    'object-curly-newline': ['error', { consistent: true }],
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': ['error', 'always'],
    'padded-blocks': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    quotes: ['error', 'single'],
    'semi-spacing': ['error'],
    'semi-style': ['error', 'last'],
    semi: ['error', 'always'],
    // Disabled pending manual resolution of violations
    // 'sort-keys': 'error',
    'space-before-blocks': [
      'error',
      'always'
    ],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': ['error', { int32Hint: false }],
    'space-unary-ops': 'error',
    'spaced-comment': ['error', 'always'],
    'switch-colon-spacing': 'error',
    'vue/script-indent': ['error', 2, { baseIndent: 1 }]
  },
  settings: {
    jest: {
      version: 29
    }
  },
  overrides: [
    {
      files: [
        '*.vue'
      ],
      rules: {
        indent: 'off'
      }
    },
    {
      files: [
        'packages/portal/src/i18n/lang/*.js'
      ],
      rules: {
        quotes: [
          'error',
          'double'
        ]
      }
    },
    {
      files: [
        '**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      },
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}
