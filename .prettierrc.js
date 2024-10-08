module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],

  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    '^react(.*)$',
    '^react-native(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^[./]',
  ],
};
