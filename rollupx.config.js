/* eslint-env node */

module.exports = {
  banner:
    '/*!\n' +
    ` * el-css-var v${require('./package.json').version}\n` +
    ` * (c) 2024-${new Date().getFullYear()} yujinpan\n` +
    ' * Released under the MIT License.\n' +
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
