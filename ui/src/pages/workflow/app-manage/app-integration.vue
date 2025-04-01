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
      await navigator.clipboard.writeText(text); // 将文本复制到剪贴板
      ElMessage({
        showClose: true,
        message: '复制成功',
        type: 'success',
      });
    } else {
      // 如果不是安全上下文，使用旧的execCommand方法
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      ElMessage({
        showClose: true,
        message: successful ? '复制成功' : '复制失败',
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
  <el-descriptions column="1" border title="调用以下HTTP接口执行当前规则链">
    <el-descriptions-item label="同步调用接口"
      ><span
        @click="
          copyToClipboard(
            '/api/v1/rules/' + props.formState.id + '/execute/{msgType}',
          )
        "
        >POST /api/v1/rules/{{ props.formState.id }}/execute/{msgType}</span
      >
      <el-tag size="small" type="info"
        >关注处理结果</el-tag
      ></el-descriptions-item
    >
    <el-descriptions-item label="异步调用接口"
      ><span
        @click="
          copyToClipboard(
            '/api/v1/rules/' + props.formState.id + '/notify/{msgType}',
          )
        "
        >POST /api/v1/rules/{{ props.formState.id }}/notify/{msgType}</span
      >
      <el-tag size="small" type="info"
        >不关注处理结果</el-tag
      ></el-descriptions-item
    >
  </el-descriptions>
</template>
