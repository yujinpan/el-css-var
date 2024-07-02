<template>
  <div>
    <h3>Button</h3>
    <hr />
    <el-button icon="el-icon-document">Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>

    <h3>Link</h3>
    <hr />
    <el-link>Default</el-link>&nbsp;
    <el-link type="primary">Primary</el-link>&nbsp;
    <el-link type="success">Success</el-link>&nbsp;
    <el-link type="info">Info</el-link>&nbsp;
    <el-link type="warning">Warning</el-link>&nbsp;
    <el-link type="danger">Danger</el-link>

    <h3>Radio</h3>
    <hr />
    <el-radio-group v-model="formModel.radio">
      <el-radio label="a">Option A</el-radio>
      <el-radio label="b">Option B</el-radio>
    </el-radio-group>
    &nbsp;&nbsp;
    <el-radio-group v-model="formModel.radio">
      <el-radio-button label="a">Option A</el-radio-button>
      <el-radio-button label="b">Option B</el-radio-button>
    </el-radio-group>

    <h3>Checkbox</h3>
    <hr />
    <el-checkbox-group v-model="formModel.checkbox">
      <el-checkbox label="a">Option A</el-checkbox>
      <el-checkbox label="b">Option B</el-checkbox>
    </el-checkbox-group>

    <h3>Input</h3>
    <hr />
    <el-input v-model="formModel.input" placeholder="placeholder" />

    <h3>Input Number</h3>
    <hr />
    <el-input-number v-model="formModel.inputNumber" />

    <h3>Select</h3>
    <hr />
    <el-select v-model="formModel.checkbox" multiple>
      <el-option value="a">Option A</el-option>
      <el-option value="b">Option B</el-option>
    </el-select>

    <h3>Cascader</h3>
    <hr />
    <el-cascader v-model="formModel.checkbox" :options="options" />

    <h3>Switch</h3>
    <hr />
    <el-switch v-model="formModel.boolean" />

    <h3>Slider</h3>
    <hr />
    <el-slider v-model="formModel.inputNumber" />

    <h3>DatePicker</h3>
    <hr />
    <el-date-picker v-model="formModel.date" />

    <h3>Rate</h3>
    <hr />
    <el-rate v-model="formModel.rate" />

    <h3>Transfer</h3>
    <hr />
    <el-transfer
      v-model="formModel.checkbox"
      :data="options.map((item) => ({ ...item, key: item.value }))"
    />

    <h3>Table</h3>
    <hr />
    <el-table :data="options" stripe>
      <el-table-column prop="value" label="Value" />
      <el-table-column prop="label" label="Label" />
    </el-table>

    <h3>Tag</h3>
    <hr />
    <el-tag closable>default</el-tag>&nbsp;
    <el-tag type="success" closable>primary</el-tag>&nbsp;
    <el-tag type="info" closable>info</el-tag>&nbsp;
    <el-tag type="warning" closable>warning</el-tag>&nbsp;
    <el-tag type="danger" closable>danger</el-tag>

    <h3>Progress</h3>
    <hr />
    <el-progress :percentage="20" define-back-color="" />
    <el-progress :percentage="50" define-back-color="" color="red" />
    <el-progress :percentage="100" define-back-color="" color="green" />
    <p>
      el-progress need remove default value: <code>define-back-color=""</code>
    </p>

    <h3>Tree</h3>
    <hr />
    <el-tree :data="options" />

    <h3>Pagination</h3>
    <hr />
    <el-pagination :total="100" background />

    <h3>Badge</h3>
    <hr />
    <el-badge value="12"><el-button>comments</el-button> </el-badge
    >&nbsp;&nbsp;&nbsp;
    <el-badge value="12" type="success">
      <el-button>comments</el-button>
    </el-badge>

    <h3>Alert</h3>
    <hr />
    <el-alert title="Title">default</el-alert>&nbsp;
    <el-alert title="Title" type="success">success</el-alert>

    <h3>Loading</h3>
    <hr />
    <el-table :data="options" stripe v-loading="1">
      <el-table-column prop="value" label="Value" />
      <el-table-column prop="label" label="Label" />
    </el-table>

    <h3>Message</h3>
    <hr />
    <el-button
      @click="$message({ type: 'info', message: 'Info', showClose: true })"
      >info</el-button
    >
    <el-button
      @click="
        $message({ type: 'warning', message: 'warning', showClose: true })
      "
      >warning</el-button
    >
    <el-button
      @click="
        $message({ type: 'success', message: 'success', showClose: true })
      "
      >success</el-button
    >

    <h3>MessageBox</h3>
    <hr />
    <el-button @click="$confirm('Are your sure?', 'Warning')"
      >Confirm</el-button
    >

    <h3>Notification</h3>
    <hr />
    <el-button @click="$notify({ title: 'Title', message: 'Message.' })"
      >Notify</el-button
    >

    <h3>Menu</h3>
    <hr />
    <el-menu mode="horizontal">
      <el-menu-item index="1">Menu1</el-menu-item>
      <el-menu-item index="2">Menu2</el-menu-item>
      <el-submenu index="3">
        <template #title>Menu3</template>
        <el-menu-item index="3-1">Menu3-1</el-menu-item>
        <el-menu-item index="3-2">Menu3-2</el-menu-item>
      </el-submenu>
    </el-menu>

    <h3>Tabs</h3>
    <hr />
    <el-tabs>
      <el-tab-pane label="Tab1">Content 1</el-tab-pane>
      <el-tab-pane label="Tab2">Content 2</el-tab-pane>
    </el-tabs>
    <hr />
    <el-tabs type="card">
      <el-tab-pane label="Tab1">Content 1</el-tab-pane>
      <el-tab-pane label="Tab2">Content 2</el-tab-pane>
    </el-tabs>

    <h3>Dialog</h3>
    <hr />
    <el-button @click="dialogVisible = true">Dialog</el-button>
    <el-dialog :visible.sync="dialogVisible" title="Dialog Title">
      Dialog Content
    </el-dialog>

    <h3>Tooltip</h3>
    <hr />
    <el-tooltip content="dark" effect="dark">
      <el-button>dark</el-button>
    </el-tooltip>
    <el-tooltip content="light" effect="light">
      <el-button>light</el-button>
    </el-tooltip>

    <h3>Popover</h3>
    <hr />
    <el-popover title="Title" content="Content">
      <el-button>Popover</el-button>
    </el-popover>

    <h3>Card</h3>
    <hr />
    <el-card>
      <template #header>Header</template>
      <template #default>Content</template>
    </el-card>

    <h3>Carousel</h3>
    <hr />
    <el-carousel style="background: var(--background-color-base)">
      <el-carousel-item>1</el-carousel-item>
      <el-carousel-item>2</el-carousel-item>
      <el-carousel-item>3</el-carousel-item>
    </el-carousel>
    <p>
      define a background:
      <code>style="background: var(--background-color-base)"</code>
    </p>

    <h3>Collapse</h3>
    <hr />
    <el-collapse>
      <el-collapse-item title="Title">Content</el-collapse-item>
      <el-collapse-item title="Title">Content</el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const formModel = ref({
  radio: 'a',
  checkbox: ['a'],
  input: '',
  inputNumber: 1,
  boolean: true,
  date: Date.now(),
  rate: 5,
});

const options = [
  {
    value: 'a',
    label: 'Option A',
    children: [
      { value: 'a-1', label: 'Option A-1' },
      { value: 'a-2', label: 'Option A-2' },
    ],
  },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
  { value: 'd', label: 'Option D' },
];

const dialogVisible = ref(false);
</script>

<style lang="scss" scoped>
.color-list {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  li {
    padding: 16px;
    margin: 0;
  }
}
</style>
