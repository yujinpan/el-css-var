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

      const darkVars = {
        '--color-primary': '#409EFF',
        '--color-white': '#1b1b1f',
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
        '--message-background-color': '#282a2d',
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
  
  .el-radio__inner::after,
  .el-switch__core:after,
  .el-slider__button {
    background-color: var(--color-text-white);
  }
  .el-select .el-tag__close.el-icon-close {
    background-color: var(--background-color-base);
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
    background-color: color-mix(in srgb, white 2.5%, var(--color-white));
  }
  .el-table--enable-row-hover .el-table__body tr.el-table__row--striped:hover > td.el-table__cell {
    background-color: var(--background-color-base);
  }
  .el-loading-mask,
  .v-modal {
    background-color: rgba(0, 0, 0, 0.7);
  }
  .el-menu {
    &.el-menu--horizontal {
      border-color: var(--border-color-base);
    }
    > .el-menu-item:not(.is-disabled):hover, 
    > .el-menu-item:not(.is-disabled):focus,
    > .el-submenu .el-submenu__title:hover {
      background-color: var(--background-color-base);
    }
  }
  .el-tooltip__popper.is-light {
    border-color: var(--border-color-base);
  }
  .el-tooltip__popper.is-light[x-placement^=top] .popper__arrow {
    border-top-color: var(--border-color-base);
  }
  .el-tooltip__popper.is-light[x-placement^=right] .popper__arrow {
    border-right-color: var(--border-color-base);
  }
  .el-tooltip__popper.is-light[x-placement^=bottom] .popper__arrow {
    border-bottom-color: var(--border-color-base);
  }
  .el-tooltip__popper.is-light[x-placement^=left] .popper__arrow {
    border-left-color: var(--border-color-base);
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
