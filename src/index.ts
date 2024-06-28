import Vue from 'vue';

import type { DEFAULT_THEME } from './default-theme';

export * from './default-theme';

export type ElThemeProp = keyof typeof DEFAULT_THEME;

export type ElThemeProps = Partial<Record<ElThemeProp, string>>;

export type ElThemeOptions = {
  theme?: 'dark' | string;
  base?: ElThemeProps;
  dark?: ElThemeProps;
  updateTheme?: (options: ElThemeOptions) => ElThemeOptions;
};

/**
 * set global theme
 */
export const useElTheme = (
  defaultOptions: ElThemeOptions = {},
): ElThemeOptions => {
  if (useElTheme['global']) return useElTheme['global'];

  const globalStore = Vue.observable<Required<ElThemeOptions>>({
    theme: '',
    base: {},
    dark: {},
    updateTheme: (options: ElThemeOptions = {}) => {
      setObj(globalStore, options);
      updateElTheme(globalStore);
      return globalStore;
    },
    ...defaultOptions,
  });

  return (useElTheme['global'] = globalStore);
};

export function updateElTheme({ theme, base, dark }: ElThemeOptions) {
  document.documentElement.classList.toggle('dark', theme === 'dark');

  let style: HTMLStyleElement;
  if (updateElTheme['style']) {
    style = updateElTheme['style'];
  } else {
    style = document.createElement('style');
    document.head.appendChild(style);
    updateElTheme['style'] = style;
  }

  style.innerHTML = `:root{${objToCss(base)}}:root .dark{${objToCss(dark)}}`;
}

/**
 * set component theme
 */
export const useElThemeComponent = () => {
  const style = Vue.observable<ElThemeProps>({});

  const updateTheme = (theme1: ElThemeProps) => {
    setObj(style, theme1);
  };

  return { style, updateTheme };
};

function objToCss(obj: object): string {
  return Object.entries(obj)
    .map(([key, val]) => `${key}:${val}`)
    .join(';');
}

function setObj<T extends object>(source: T, target: T): T {
  for (const key in target) {
    Vue.set(source, key, target[key]);
  }
  return source;
}
