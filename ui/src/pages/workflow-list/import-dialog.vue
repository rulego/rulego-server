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
          <el-button type="default">导入规则链DSL文件</el-button>
        </el-upload>
      </el-form-item>
      <el-row style="width: 100%">
        <el-col :span="18"><label>在下方粘贴规则链DSL</label></el-col>
        <el-col :span="6" style="text-align: right">
          <el-button type="info" size="small" round @click="formatCode"
            >整理</el-button
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
            placeholder="请粘贴规则链DSL"
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
          >导入</el-button
        >
        <el-button size="large" @click="handleClose">取消</el-button>
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

//表单引用
const formRef = ref();
const fileList = ref();
const isFullscreen = ref(false);
const codeEditorRef = ref(null);
const codeEditorHeight = ref('400px');

const form = reactive({
  data: '',
});

function handleChange(file, fileList) {
  // 清空之前的文件列表
  fileList.value = fileList;
  // 读取文件内容
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
  // 禁用默认上传行为
  return false;
}

const handleSubmit = () => {
  importHandler();
};
async function importHandler() {
  try {
    let ruleChain = JSON.parse(form.data);
    if (!ruleChain.ruleChain.id) {
      ElMessage.error('规则链ID不能为空');
      return;
    }
    await Api.setRules(ruleChain.ruleChain.id, form.data);
    ElMessage.success('导入成功');
    emit('success', ruleChain.ruleChain.id);
  } catch (error) {
    ElMessage.error('错误:' + error);
  } finally {
    close();
  }
}

const handleClose = () => {
  close();
  emit('close');
};
//格式化js代码
const formatCode = function () {
  form.data = beautify.js(form.data, { indent_size: 2 });
};
//全屏
const toggleFullScreen = () => {
  if (screenfull.isEnabled) {
    if (!screenfull.isFullscreen) {
      // 请求全屏
      screenfull.request(codeEditorRef.value[0]);
    } else {
      // 退出全屏
      screenfull.exit();
    }
  }
};
// 监听全屏变化
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
