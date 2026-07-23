<script lang="js" setup>
import { ref } from 'vue';
import en from 'element-plus/es/locale/lang/en';

const locale = ref(en);
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>
