<script lang="js" setup>
import { ref } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const locale = ref(zhCn);
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
