import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'

const style = {
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/array-bracket-newline': ['error', 'consistent'],
    '@stylistic/object-curly-newline': ['error', { consistent: true }],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/type-annotation-spacing': ['error', {
      before: false,
      after: true,
      overrides: { arrow: 'ignore' },
    }],
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/arrow-spacing': 'error',
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    '@stylistic/padded-blocks': ['error', 'never'],
    '@stylistic/lines-between-class-members': ['error', 'always'],
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' },
      { blankLine: 'never', prev: 'case', next: 'case' },
      { blankLine: 'never', prev: 'break', next: 'case' },
      { blankLine: 'never', prev: 'case', next: 'break' },
    ],
    curly: ['error', 'multi-line'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ConditionalExpression',
        message: 'Use if/else instead of the ternary operator.',
      },
    ],
  },
}

const scriptStyle = {
  plugins: style.plugins,
  rules: {
    ...style.rules,
    // The extracted script includes the indent before </script> as its own line.
    // no-trailing-spaces deletes it, then indent on the .astro file puts it back.
    '@stylistic/no-trailing-spaces': 'off',
  },
}

export default tseslint.config(
  { ignores: ['node_modules/**', '.astro/**', 'dist/**', 'src/data/scripts/**'] },
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.astro/**'],
    extends: [tseslint.configs.recommended],
    ...style,
    rules: {
      ...style.rules,
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    plugins: style.plugins,
    rules: {
      ...style.rules,
    },
  },
  {
    files: ['**/*.astro/**/*.ts'],
    extends: [tseslint.configs.recommended],
    ...scriptStyle,
    rules: {
      ...scriptStyle.rules,
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['**/*.astro/**/*.js'],
    plugins: scriptStyle.plugins,
    rules: {
      ...scriptStyle.rules,
    },
  },
)
