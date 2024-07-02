<template>
  <div>
    <h2>Theme Settings</h2>
    <el-form>
      <el-form-item label="Mode">
        <el-button @click="theme.updateTheme({ theme: '' })">light</el-button>
        <el-button @click="theme.updateTheme({ theme: 'dark' })">
          dark
        </el-button>
      </el-form-item>
      <el-form-item label="Base Color">
        <el-table :data="colorData" max-height="340px">
          <el-table-column prop="name" label="Name"></el-table-column>
          <el-table-column label="Base Variables" width="180">
            <template #default="{ row }">
              <span>{{ row.base }}</span>
              &nbsp;
              <el-color-picker
                @change="theme.updateTheme({ base: { [row.name]: $event } })"
                :value="row.base"
                :predefine="[DEFAULT_THEME[row.name]]"
                size="mini"
              />
            </template>
          </el-table-column>
          <el-table-column label="Dark Variables" width="180">
            <template #default="{ row }">
              <template v-if="row.dark">
                <span>{{ row.dark }}</span>
                &nbsp;
                <el-color-picker
                  @change="theme.updateTheme({ dark: { [row.name]: $event } })"
                  :value="row.dark"
                  :predefine="[DARK_THEME[row.name]]"
                  size="mini"
                />
              </template>
              <span v-else>
                (inherit base)
                <el-button
                  @click="theme.updateTheme({ dark: { [row.name]: row.base } })"
                  size="mini"
                >
                  Add
                </el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-button @click="exportVars('css')">Export CSS Variables</el-button>
      <el-button @click="exportVars('js')">Export JS Variables</el-button>
      <el-button @click="exportVars('')">Hide</el-button>

      <el-input
        v-if="exportVarsType"
        ref="textarea"
        :value="exportVarsType === 'css' ? cssVars : jsVars"
        type="textarea"
        style="margin-top: 10px"
        rows="10"
        readonly
      />
    </el-form>

    <h2>Components Preview</h2>
    <ComponentsPreview />
  </div>
</template>

<script lang="ts" setup>
import Vue, { computed, ref, nextTick } from 'vue';

import ComponentsPreview from './components-preview.vue';
import { useElTheme, DARK_THEME, DEFAULT_THEME } from '../../src';

const theme = useElTheme({ base: DEFAULT_THEME, dark: DARK_THEME });

const colorData = computed(() =>
  Object.entries(theme.base).map(([name, base]) => ({
    name,
    base,
    dark: theme.dark[name],
  })),
);

const exportVarsType = ref('');

const textarea = ref();

const exportVars = (type: 'css' | 'js' | '') => {
  exportVarsType.value = type;

  if (type) {
    nextTick(() => {
      const el = textarea.value.$refs.textarea as HTMLTextAreaElement;

      el.select();
      el.setSelectionRange(0, el.value.length);

      navigator.clipboard.writeText(el.value);

      Vue.prototype.$message.success('Copied!');
    });
  }
};

const cssVars = computed(() => {
  const base = colorData.value
    .map((item) => `  ${item.name}: ${item.base};`)
    .join('\n');
  const dark = colorData.value
    .filter((item) => item.dark)
    .map((item) => `  ${item.name}: ${item.dark};`)
    .join('\n');

  return `:root {
${base}  
}

.dark {
${dark}
}`;
});
const jsVars = computed(() => {
  const base = colorData.value
    .map((item) => `  '${item.name}': '${item.base}';`)
    .join('\n');
  const dark = colorData.value
    .filter((item) => item.dark)
    .map((item) => `  '${item.name}': '${item.dark}';`)
    .join('\n');

  return `export const BASE_THEME = {
${base}  
}

export const DARK_THEME = {
${dark}
}`;
});
</script>

<style lang="scss" scoped>
.el-color-picker {
  vertical-align: middle;
}
</style>
