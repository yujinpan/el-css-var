# ElementUI CSS Variables

Change el scss variables to css.

[Theme Generator & Preview](https://yujinpan.github.io/el-css-var/theme.html).

## Usage

```shell
npm i el-css-var
```

Instead of element-ui styles.

### import SCSS

```ts
// main.ts

// old
import 'element-ui/packages/theme-chalk/src/index.scss'; // [!code --]

// new
import 'el-css-var/dist/index.scss'; // [!code ++]
import 'el-css-var/dist/dark.scss'; // [!code ++] // optional
```

And use scss variables:

```scss
@use 'el-css-var/dist/common/var.scss';

.container {
  color: var.$color-primary;
}
```

### import CSS

```ts
// main.ts

// old
import 'element-ui/packages/theme-chalk/lib/index.css'; // [!code --]

// new
import 'el-css-var/dist/index.css'; // [!code ++]
import 'el-css-var/dist/dark.css'; // [!code ++] // optional
```

## Custom Theme

Support use CSS variables and JS API to custom theme.

### CSS variables

```scss
// index.scss
@import "el-css-var/dist/index.css";

:root {
  --color-primary: red;
}
```

### JS API

Support global and component.

#### Global Theme

```vue
<script>
import { useElTheme } from 'el-css-var';

export default {
  mounted() {
    const elTheme = useElTheme();

    elTheme.updateTheme({
      base: {
        '--color-primary': 'red',
      }
    });
  }
}
</script>
```

#### Component Theme

```vue
<template>
  <div :style="style">
    <el-button>Custom Theme</el-button>
  </div>
</template>

<script>
import { useElThemeComponent } from 'el-css-var';

export default {
  setup() {
    const { style, updateTheme } = useElThemeComponent();

    updateTheme({
      '--color-primary': 'red'
    })
    
    return {
      style
    }
  }
}
</script>
```

### Variables

These variables can all use in css var.

<<< @/src/default-theme.ts