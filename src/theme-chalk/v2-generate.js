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
    let content = fs.readFileSync(file).toString();
    if (file.endsWith('.scss')) {
      if (file.endsWith('var.scss')) {
        // prepend vars
        content =
          `// New vars by v2-generate.js
// replace font color "$--color-white"
$--color-text-white: #FFFFFF !default;\n\n` + content;
      }

      content = patchDeprecation(content);
      content = removeExpression(content);
      content = content.replace(
        /(font-|\s)color: \$--color-white/g,
        '$1color: $--color-text-white',
      );
    }

    const distFile = path.join(distPath, path.relative(srcPath, file));
    makeDir.sync(path.dirname(distFile));
    fs.writeFileSync(distFile, content);
  });

  // var-css
  updateFileContent(
    path.resolve(distPath, './common/var.scss'),
    (varContent) => {
      const { cssVar, content } = sassVarsToCss(varContent);

      const darkVars = {
        '--color-primary': '#409EFF',
        '--color-white': '#282a2d',
        '--color-black': 'rgba(255, 255, 255, 0.55)',
        // '--color-success': '#67C23A',
        // '--color-warning': '#E6A23C',
        // '--color-danger': '#F56C6C',
        // '--color-info': '#909399',
        '--color-text-primary': '#e8eaed',
        '--color-text-regular': 'rgba(255, 255, 255, 0.75)',
        '--color-text-secondary': 'rgba(255, 255, 255, 0.65)',
        '--color-text-placeholder': 'rgba(255, 255, 255, 0.55)',
        '--border-color-base': '#434343',
        '--border-color-light': 'rgba(255, 255, 255, 0.3)',
        '--border-color-lighter': 'rgba(255, 255, 255, 0.2)',
        '--border-color-extra-light': 'rgba(255, 255, 255, 0.1)',
        '--background-color-base': '#282a2d',
        // '--font-color-disabled-base': '#bbb',
        // '--icon-color': '#666',
        // '--checkbox-disabled-input-fill': '#edf2fc',
        // '--select-multiple-input-color': '#666',
        // '--select-dropdown-empty-color': '#999',
        // '--message-background-color': '#edf2fc',
        // '--cascader-tag-background': '#f0f2f5',
        '--datepicker-inner-border-color': 'rgba(255, 255, 255, 0.3)',
        '--datepicker-cell-hover-color': 'rgba(255, 255, 255, 0.3)',
        // '--calendar-selected-background-color': '#F2F8FE',
        // '--avatar-font-color': '#fff',
        // '--avatar-background-color': '#C0C4CC',
        // '--descriptions-item-bordered-label-background': '#fafafa',
        // '--skeleton-color': '#f2f2f2',
        // '--skeleton-to-color': '#e6e6e6',
        // '--svg-monochrome-grey': '#DCDDE0',
      };
      const darkVarsContent = `.dark {
${Object.entries(darkVars)
  .map(([key, value]) => `  ${key}: ${value};`)
  .join('\n')}
  
  .el-radio__inner::after {
    background-color: var(--color-text-white);
  }
}\n`;

      fs.writeFileSync(
        path.resolve(distPath, './common/var-css.scss'),
        cssVar + '\n\n' + darkVarsContent,
      );

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
  content.match(/(mix\(|rgba\(\$)[^)]*\)/g)?.map((item) => {
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
    const [mixColor, baseColor, percent] = args.split(', ');
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
