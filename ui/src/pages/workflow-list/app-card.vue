<script lang="js" setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
  },
});

const emit = defineEmits([
  'delete',
  'manage',
  'design',
  'deployment',
  'export',
]);

function deleteHandler() {
  emit('delete');
}

function manageHandler() {
  emit('manage');
}

function designHandler() {
  emit('design');
}

function deploymentHandler() {
  emit('deployment');
}
function exportHandler() {
  emit('export');
}
</script>

<template>
  <div class="h-44 w-full flex-none pb-4 pr-4 md:w-1/2 xl:w-1/4">
    <div
      :class="[
        'h-full w-full rounded-xl border border-[var(--el-border-color)] p-4 transition duration-500',
        props.disabled
          ? 'cursor-not-allowed bg-[#f5f7fa]'
          : 'hover:cursor-pointer hover:shadow-xl',
      ]"
    >
      <div class="flex h-full flex-col">
        <div class="flex flex-none">
          <div class="relative h-10 w-10 flex-none rounded bg-[#fdead5]">
            <div
              class="absolute bottom-[-2px] right-[-2px] flex h-5 w-5 items-center justify-center rounded border border-[var(--el-border-color)] bg-white"
            >
              <el-icon><el-icon-cpu /></el-icon>
            </div>
          </div>
          <div class="flex-grow overflow-auto truncate pl-4">
            {{ props.name }}
          </div>
          <div @click.stop>
            <el-dropdown
              trigger="click"
              :teleported="false"
              :show-arrow="false"
            >
              <el-button icon="el-icon-more-filled" :text="true"> </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="manageHandler"
                    >管理</el-dropdown-item
                  >
                  <el-dropdown-item @click="designHandler"
                    >设计</el-dropdown-item
                  >
                  <el-dropdown-item :divided="true" @click="deploymentHandler">
                    {{ props.disabled ? '部署' : '下线' }}
                  </el-dropdown-item>
                  <el-dropdown-item :divided="true"> 复制 </el-dropdown-item>
                  <el-dropdown-item @click="exportHandler"
                    >导出</el-dropdown-item
                  >
                  <el-dropdown-item :divided="true" @click="deleteHandler"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="flex-grow overflow-hidden pt-4 text-sm text-slate-500">
          <div class="line-clamp-3">{{ props.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
