import '../../dist/index.css';
import '../../dist/dark.css';
import ElementUI from 'element-ui';
import DefaultTheme from 'vitepress/theme';

import type { Theme } from 'vitepress';
import './custom.css';

export default {
  extends: DefaultTheme,
  async enhanceApp(context) {
    context.app.use(ElementUI);
  },
} as Theme;
