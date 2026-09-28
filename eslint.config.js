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
    '@stylistic/type-annotation-spacing': ['error', { before: false, after: true }],
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/arrow-spacing': 'error',
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    '@stylistic/padded-blocks': ['error', 'never'],
    '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'never', prev: 'block-like', next: 'block-like' },
      { blankLine: 'never', prev: 'expression', next: 'block-like' },
      { blankLine: 'never', prev: 'block-like', next: 'expression' },
      { blankLine: 'never', prev: 'import', next: 'import' },
      { blankLine: 'never', prev: 'case', next: 'case' },
      { blankLine: 'never', prev: 'break', next: 'case' },
      { blankLine: 'never', prev: 'case', next: 'break' },
      { blankLine: 'never', prev: 'block-like', next: 'return' },
      { blankLine: 'never', prev: 'expression', next: 'return' },
    ],
    curly: ['error', 'multi-line'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
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
  },
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    ...style,
  },
  {
    files: ['**/*.astro/**/*.ts'],
    extends: [tseslint.configs.recommended],
    ...scriptStyle,
  },
  {
    files: ['**/*.astro/**/*.js'],
    ...scriptStyle,
  },
)
