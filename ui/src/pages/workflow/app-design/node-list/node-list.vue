<script lang="js" setup>
import { ref, computed } from 'vue';
import { onClickOutside, useResizeObserver } from '@vueuse/core';
import Fuse from 'fuse.js';

const props = defineProps({
  x: Number,
  y: Number,
  rootReact: Object,
  menuList: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['selected']);

const containerRef = ref();
const keyword = ref('');
const isShow = ref(false);
const containerReact = ref({
  width: 0,
  height: 0,
});

const menuList = computed(() => {
  const list = Object.keys(props.menuList).map((key) => {
    const item = props.menuList[key];
    return {
      key: key,
      label: item.label,
      value: item,
    };
  });

  let fuse = new Fuse(list, {
    keys: ['value.components.label'],
  });

  if (keyword.value === '') {
    return list;
  }

  const newMenuList = fuse.search(keyword.value).map((item) => {
    let newFuse = new Fuse(item.item.value.components, {
      keys: ['label'],
    });
    const res = newFuse.search(keyword.value).map((item) => {
      return item.item;
    });
    newFuse = null;
    return {
      ...item.item,
      value: {
        ...item.item.value,
        components: res,
      },
    };
  });

  fuse = null;

  return newMenuList;
});

const x = computed(() => {
  let x = props.x;
  if (x + containerReact.value.width > props.rootReact.width) {
    x = x - containerReact.value.width;
  }
  x < 0 && (x = 0);
  return x;
});
const y = computed(() => {
  let y = props.y - containerReact.value.height / 2;
  if (y + containerReact.value.height > props.rootReact.height) {
    y = props.rootReact.height - containerReact.value.height;
  }
  y < 0 && (y = 0);
  return y;
});

useResizeObserver(containerRef, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  containerReact.value.width = width;
  containerReact.value.height = height;
});
onClickOutside(containerRef, hide);

function show() {
  if (isShow.value) return;
  isShow.value = true;
}

function hide() {
  if (!isShow.value) return;
  isShow.value = false;
}

function emitSelected(item) {
  keyword.value = '';
  hide();
  emit('selected', item);
}

defineExpose({
  show,
  hide,
});
</script>

<template>
  <div
    class="absolute left-0 top-0 z-10 max-h-full max-w-full rounded-xl border border-solid bg-white"
    :style="[
      { left: `${x}px`, top: `${y}px` },
      isShow ? {} : { left: '-10000%', top: '-10000%', zIndex: '-1' },
    ]"
    ref="containerRef"
  >
    <el-scrollbar :max-height="`${rootReact.height}px`">
      <div class="w-[200px]">
        <div class="p-2">
          <el-input v-model="keyword" placeholder="搜索节点"></el-input>
        </div>
        <div class="p-2 pt-0">
          <div v-for="item in menuList" :key="item.key">
            <div
              class="flex h-[22px] items-center px-2 text-xs text-gray-500"
              v-if="item.value.components && item.value.components.length > 0"
            >
              {{ item.label }}
            </div>
            <div
              class="flex h-[32px] items-center rounded px-2 hover:cursor-pointer hover:bg-gray-100"
              v-for="component in item.value.components || []"
              :key="component.type"
              @click="emitSelected(component)"
            >
              <div
                class="mr-2 h-[20px] w-[20px] flex-none rounded bg-blue-600"
              ></div>
              <div class="flex-grow overflow-auto truncate text-stone-600">
                {{ component.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
