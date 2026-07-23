<script lang="js" setup>
import { ElMessage } from 'element-plus';

const props = defineProps({
  formState: {
    type: Object,
    default: () => ({
      id: '',
      name: '',
      description: '',
      root: false,
      debugMode: true,
    }),
  },
});

const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text); // Copy the text to the clipboard
      ElMessage({
        showClose: true,
        message: 'Copied successfully',
        type: 'success',
      });
    } else {
      // Use the legacy execCommand method outside a secure context
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      ElMessage({
        showClose: true,
        message: successful ? 'Copied successfully' : 'Copy failed',
        type: successful ? 'success' : 'error',
      });
      document.body.removeChild(textArea);
    }
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};
</script>

<template>
  <el-descriptions
    column="1"
    border
    title="Call the following HTTP interface to execute the current rule chain"
  >
    <el-descriptions-item label="Synchronous call interface"
      ><span
        @click="
          copyToClipboard(
            '/api/v1/rules/' + props.formState.id + '/execute/{msgType}',
          )
        "
        >POST /api/v1/rules/{{ props.formState.id }}/execute/{msgType}</span
      >
      <el-tag size="small" type="info">Waits for the processing result</el-tag>
    </el-descriptions-item>
    >
    <el-descriptions-item label="Asynchronous call interface"
      ><span
        @click="
          copyToClipboard(
            '/api/v1/rules/' + props.formState.id + '/notify/{msgType}',
          )
        "
        >POST /api/v1/rules/{{ props.formState.id }}/notify/{msgType}</span
      >
      <el-tag size="small" type="info"
        >Does not wait for the processing result</el-tag
      >
    </el-descriptions-item>
    >
  </el-descriptions>
</template>
