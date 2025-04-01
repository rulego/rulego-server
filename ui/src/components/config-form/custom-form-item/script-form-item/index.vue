<script lang="js" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useFormItem } from 'element-plus';
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import jsBeautify from 'js-beautify';
import { useFullscreen } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const { formItem } = useFormItem();
const editorRef = ref();
const fullscreenRef = ref();
const { isFullscreen, toggle } = useFullscreen(fullscreenRef);
const lineNumberWidth = ref(0);
let editorV = undefined;

function updateLineNumberWidth(e) {
  const viewDom = e.view.dom;
  const cmGuttersDom = viewDom.querySelector('.cm-gutters');
  if (cmGuttersDom) {
    const react = cmGuttersDom.getBoundingClientRect();
    lineNumberWidth.value = react.width;
  }
}

function emitUpdateModelValue(e) {
  emit('update:modelValue', e.state.doc.toString());
}

function initEditor() {
  editorV = new EditorView({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      javascript(),
      EditorView.updateListener.of((e) => {
        updateLineNumberWidth(e);
        emitUpdateModelValue(e);
      }),
    ],
    parent: editorRef.value,
  });
}

function formatCodeHandler() {
  if (!editorV) return;
  const code = editorV.state.doc.toString();
  const formatCode = jsBeautify(code);
  editorV.dispatch({
    changes: {
      from: 0,
      to: editorV.state.doc.length,
      insert: formatCode,
    },
  });
}

watch(
  () => props.modelValue,
  () => {
    formItem?.validate?.('change');
  },
);

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  editorV?.destroy();
});
</script>

<template>
  <div
    ref="fullscreenRef"
    class="relative flex w-full flex-col border border-solid border-[#10182814] bg-white"
  >
    <div v-if="props.label" class="flex flex-none font-mono leading-[1.4]">
      <div
        class="flex-none border-r border-solid border-[#ddd] bg-[#f5f5f5] text-[#6c6c6c]"
        :style="{
          width: `${lineNumberWidth}px`,
        }"
      ></div>
      <div class="flex-grow pl-[6px]">
        <div class="flex justify-end py-2 pr-2">
          <el-button size="small" @click="formatCodeHandler">整理</el-button>
          <el-button
            size="small"
            @click="toggle"
            icon="el-icon-full-screen"
          ></el-button>
        </div>
        <div>{{ props.label }}</div>
      </div>
    </div>
    <div class="h-[300px] w-full" :class="{ 'flex-grow': isFullscreen }">
      <div ref="editorRef" class="editor"></div>
    </div>
    <div v-if="props.desc" class="flex flex-none font-mono leading-[1.4]">
      <div
        class="flex shrink-0 border-r border-solid border-[#ddd] bg-[#f5f5f5] text-[#6c6c6c]"
        :style="{
          width: `${lineNumberWidth}px`,
        }"
      ></div>
      <div class="pl-[6px]">{{ props.desc }}</div>
    </div>
  </div>
</template>

<style scoped>
.editor,
:deep(.editor .cm-editor) {
  height: 100%;
}
</style>
