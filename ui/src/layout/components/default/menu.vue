<script lang="js" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();

const activeIndex = ref('workflow-list');

function handleOpen() {}
function handleClose() {}
function handleSelect(val) {
  if (val === activeIndex.value) return;
  activeIndex.value = val;
  router.push({ name: val });
}

onMounted(() => {
  const { name } = useRoute();
  activeIndex.value = name;
});
</script>

<template>
  <div
    class="flex h-full flex-col overflow-auto border-r border-[var(--el-border-color)]"
  >
    <div class="flex-grow overflow-auto">
      <el-menu
        :default-active="activeIndex"
        class="default-layout-menu"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
      >
        <el-menu-item-group title="工作台">
          <el-menu-item index="workflow-list">
            <el-icon><el-icon-menu /></el-icon>
            <span>我的应用</span>
          </el-menu-item>
          <el-menu-item index="runs" @click="ElMessage.error('功能暂未实现')">
            <el-icon><el-icon-video-play /></el-icon>
            <span>运行日志</span>
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="应用市场">
          <el-menu-item
            index="app-market"
            @click="ElMessage.error('功能暂未实现')"
          >
            <el-icon><el-icon-box /></el-icon>
            <span>应用市场</span>
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="管理">
          <el-menu-item index="share-node-list">
            <el-icon><el-icon-connection /></el-icon>
            <span>授权配置</span>
          </el-menu-item>
          <el-menu-item
            index="node-manage"
            @click="ElMessage.error('功能暂未实现')"
          >
            <el-icon><el-icon-suitcase /></el-icon>
            <span>组件管理</span>
          </el-menu-item>
          <el-menu-item
            index="system-manage"
            @click="ElMessage.error('功能暂未实现')"
          >
            <el-icon><el-icon-setting /></el-icon>
            <span>系统管理</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </div>
  </div>
</template>

<style scoped>
.default-layout-menu {
  border-right: none;
}
</style>
