/* eslint-env node */

const fs = require('fs');
const glob = require('glob');
const makeDir = require('make-dir');
const path = require('node:path');
const { build } = require('rollupx');

generateV2();

function generateV2() {
  const srcPath = path.resolve(__dirname, './src');
  const distPath = path.resolve(__dirname, './src-v2');
  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });

  const files = glob.sync(path.resolve(srcPath, './**/*.*'));

  files.forEach((file) => {
    const distFile = path.join(distPath, path.relative(srcPath, file));
    makeDir.sync(path.dirname(distFile));

    if (file.endsWith('.scss')) {
      let content = fs.readFileSync(file).toString();

      if (file.endsWith('var.scss')) {
        // prepend vars
        content =
          `// Prepend vars by v2-generate.js
// replace font color "$--color-white"
$--color-text-white: #FFFFFF !default;\n\n` + content;
        // replace vars
        content = content.replace(
          '$--checkbox-checked-icon-color: $--fill-base',
          '$--checkbox-checked-icon-color: $--color-text-white',
        );
      }

      content = patchDeprecation(content);
      content = removeExpression(content);

      // replace vars
      content = content.replace(
        /(font-|\s)color: \$--color-white/g,
        '$1color: $--color-text-white',
      );

      fs.writeFileSync(distFile, content);
    } else {
      fs.cpSync(file, distFile);
    }
  });

  // var-css
  updateFileContent(
    path.resolve(distPath, './common/var.scss'),
    (varContent) => {
      const { cssVar, content } = sassVarsToCss(varContent);

      const darkVars =
        fs
          .readFileSync(path.resolve(distPath, './dark.scss'))
          .toString()
          .match(/--[\w-]+: [^;]+/g)
          ?.reduce((a, b) => {
            const [key, val] = b.split(': ');
            return { ...a, [key]: val };
          }, {}) || [];

      fs.writeFileSync(path.resolve(distPath, './common/var-css.scss'), cssVar);

      updateFileContent(path.resolve(distPath, './base.scss'), (content) => {
        return '@use "./common/var-css.scss";\n' + content;
      });

      // index.ts
      updateFileContent(path.resolve(__dirname, '../default-theme.ts'), () => {
        const cssVarArr =
          cssVar
            .match(/[\w-]+:\s?[^;]+/g)
            ?.map((item) => item.split(':').map((item) => item.trim())) || [];
        return `/* GENERATE by v2-generate.js */
export const DEFAULT_THEME = {
${cssVarArr.map(([key, value]) => `  '${key}': '${value}',`).join('\n')}
};

export const DARK_THEME = {
${Object.entries(darkVars)
  .map(([key, value]) => `  '${key}': '${value}',`)
  .join('\n')}
};
`;
      });

      return content;
    },
  );

  // remove comments like that: /* */
  [
    path.resolve(distPath, './common/var.scss'),
    path.resolve(distPath, './mixins/mixins.scss'),
    path.resolve(distPath, './mixins/function.scss'),
  ].forEach((file) => {
    updateFileContent(file, (varContent) => {
      return varContent.replace(/\/\*\s([\w -]+)(\s|\n\s*-+\s*)\*\//g, '// $1');
    });
  });

  // build css
  build(
    {
      outputs: ['styles'],
      outputDir: distPath,
      stylesDir: distPath,
      stylesParseFiles: ['**/*.scss'],
    },
    false,
  );
}

function updateFileContent(file, contentCallback) {
  const content = fs.readFileSync(file).toString();
  fs.writeFileSync(file, contentCallback(content));
}

function removeExpression(content) {
  content.match(/\s(mix\(|rgba\(\$)[^)]*\)/g)?.map((item) => {
    item = item.trim();
    content = content.replace(item, sassExpressionToCss(item, content));
  });
  return content;
}

function sassVarsToCss(content) {
  const cssVar = [];
  content.match(/\$--([\w-]+): (#\w+)/g)?.map((item) => {
    const [key, val] = item.split(': ');
    const cssValKey = key.slice(1);
    cssVar.push(`${cssValKey}: ${val};`);
    content = content.replace(item, item.replace(val, `var(${cssValKey})`));
  });
  return {
    cssVar: `/* Generate by v2-generate.js */
:root {
${cssVar.map((item) => '  ' + item).join('\n')}
}`,
    content,
  };
}

function sassExpressionToCss(expression) {
  const fun = expression.slice(0, expression.indexOf('('));
  const args = expression.slice(
    expression.indexOf('(') + 1,
    expression.indexOf(')'),
  );

  if (fun === 'mix') {
    const [mixColor, baseColor, percent = '50%'] = args.split(', ');
    return `color-mix(in srgb, ${mixColor} ${percent}, ${baseColor})`;
  } else if (fun === 'rgba') {
    const [color, opacity] = args.split(', ');
    return `color-mix(in srgb, ${color} ${opacity}, transparent)`;
  } else {
    throw new Error(`Unsupported expression: ${expression}`);
  }
}

function patchDeprecation(content) {
  content.match(/\/\s?\d+/g)?.map((item) => {
    const [, b] = item.split('/');
    content = content.replaceAll(item, '* ' + (1 / b.trim()).toFixed(2));
  });

  return content;
}
