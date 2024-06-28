/* eslint-env node */

module.exports = {
  banner:
    '/*!\n' +
    ` * el-css-var ${require('./package.json').version}\n` +
    ` * (c) 2024-present\n` +
    ' */\n',

  aliasConfig: {
    '@': 'src',
  },

  formats: [
    {
      format: 'es',
      inputFiles: ['**/*'],
      outputDir: 'dist/es',
      outputFile: '[name][ext]',
    },
    {
      format: 'cjs',
      inputFiles: ['**/*'],
      outputDir: 'dist//cjs',
      outputFile: '[name][ext]',
    },
  ],

  typesOutputDir: 'types',

  node: true,
};
