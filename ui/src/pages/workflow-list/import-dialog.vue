<template>
  <el-dialog
    :append-to-body="true"
    :destroy-on-close="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    width="70%"
    draggable
    :before-close="handleClose"
    :modelValue="dialogVisible"
  >
    <el-form
      :model="form"
      ref="formRef"
      label-position="top"
      label-width="auto"
      class="rulego-editor-property-form"
    >
      <el-form-item>
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          :action="null"
          :on-change="handleChange"
          :before-upload="handleBeforeUpload"
          :limit="1"
          accept=".json"
        >
          <el-button type="default">Import the rule chain DSL file</el-button>
        </el-upload>
      </el-form-item>
      <el-row style="width: 100%">
        <el-col :span="18"
          ><label>Paste the Rule Chain DSL below</label></el-col
        >
        <el-col :span="6" style="text-align: right">
          <el-button type="info" size="small" round @click="formatCode"
            >Organize</el-button
          >
          <el-button
            :icon="isFullscreen ? BottomLeft : FullScreen"
            size="small"
            @click="toggleFullScreen"
            circle
          />
        </el-col>
      </el-row>
      <el-form-item label="" prop="data">
        <div ref="codeEditorRef" style="width: 100%">
          <codemirror
            v-model="form.data"
            placeholder="Please paste the rule chain DSL"
            :style="{ height: codeEditorHeight, width: '100%' }"
            :autofocus="true"
            :tabSize="2"
            :extensions="extensions"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto; text-align: right">
        <el-button type="primary" size="large" @click="handleSubmit"
          >Introduction</el-button
        >
        <el-button size="large" @click="handleClose">Cancel</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { FullScreen, BottomLeft } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import { reactive, ref, toRaw } from 'vue';
import screenfull from 'screenfull';
import beautify from 'js-beautify';
import { nanoid } from 'nanoid';
import * as Api from '@src/api';

const extensions = [json()];

const emit = defineEmits(['submit', 'close', 'success']);

//Form reference
const formRef = ref();
const fileList = ref();
const isFullscreen = ref(false);
const codeEditorRef = ref(null);
const codeEditorHeight = ref('400px');

const form = reactive({
  data: '',
});

function handleChange(file, fileList) {
  // Clear the previous file list
  fileList.value = fileList;
  // Read the file content
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      form.data = e.target.result;
    } catch (error) {
      ElMessage.error('Invalid JSON format:' + error);
    }
  };
  reader.readAsText(file.raw);
}

function handleBeforeUpload(file) {
  // Disable default upload behavior
  return false;
}

const handleSubmit = () => {
  importHandler();
};
async function importHandler() {
  try {
    let ruleChain = JSON.parse(form.data);
    if (!ruleChain.ruleChain.id) {
      ElMessage.error('The rule chain ID cannot be empty');
      return;
    }
    await Api.setRules(ruleChain.ruleChain.id, form.data);
    ElMessage.success('Successful implementation');
    emit('success', ruleChain.ruleChain.id);
  } catch (error) {
    ElMessage.error('Error:' + error);
  } finally {
    close();
  }
}

const handleClose = () => {
  close();
  emit('close');
};
//Formatting JS code
const formatCode = function () {
  form.data = beautify.js(form.data, { indent_size: 2 });
};
//Full screen
const toggleFullScreen = () => {
  if (screenfull.isEnabled) {
    if (!screenfull.isFullscreen) {
      // Request full screen
      screenfull.request(codeEditorRef.value[0]);
    } else {
      // Exiting full screen
      screenfull.exit();
    }
  }
};
// Monitor full-screen changes
screenfull.on('change', () => {
  if (!screenfull.isFullscreen) {
    codeEditorHeight.value = '400px';
    isFullscreen.value = false;
  } else {
    codeEditorHeight.value = window.innerHeight + 'px';
    isFullscreen.value = true;
  }
});
const dialogVisible = ref(false);
function open() {
  dialogVisible.value = true;
}

function close() {
  dialogVisible.value = false;
  form.data = '';
}

defineExpose({
  open,
  close,
});
</script>

<style lang="less"></style>
