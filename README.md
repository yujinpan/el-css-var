# ElementUI CSS Variables

Change el scss variables to css.

## Usage

```shell
npm i el-css-var
```

Instead of element-ui styles.

### import SCSS

```ts
// main.ts
import 'element-ui/packages/theme-chalk/src/index.scss'; // [!code --]
import 'el-css-var/dist/src/index.scss'; // [!code ++]
import 'el-css-var/dist/src/dark.scss'; // [!code ++] // optional
```

### import CSS

```ts
// main.ts
import 'element-ui/packages/theme-chalk/lib/index.css'; // [!code --]
import 'el-css-var/dist/lib/index.css'; // [!code ++]
import 'el-css-var/dist/src/dark.css'; // [!code ++] // optional
```

## Custom Theme

Support use CSS variables and JS API to custom theme.

### CSS variables

```scss
// index.scss
@import "el-css-var/dist/lib/index.css";

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
    const { updateBase, updateDark } = useElTheme();

    updateBase({
      '--color-primary': 'red',
    })

    updateDark({
      '--color-primary': 'gray',
    })
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
    const { style, update } = useElThemeComponent();
    
    update({
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