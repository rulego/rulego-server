<script lang="js" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useFormItem } from 'element-plus';
import { basicSetup, EditorView } from 'codemirror';
import { json } from '@codemirror/lang-json';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const { formItem } = useFormItem();
const editorRef = ref();
let editorV = undefined;

function emitUpdateModelValue(e) {
  emit('update:modelValue', e.state.doc.toString());
}

function initEditor() {
  editorV = new EditorView({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      json(),
      EditorView.updateListener.of((e) => {
        emitUpdateModelValue(e);
      }),
    ],
    parent: editorRef.value,
  });
}

/**
 * 获取滚动位置 (Get Scroll Position)
 * This function retrieves the current scroll position of an element.
 * It is used to track the vertical and horizontal scroll offsets.
 * @returns {{ x: number, y: number }} An object containing the x and y scroll positions.
 * @example
 * const scrollInfo = jsonEditor.getScrollInfo();
 * console.log(scrollInfo.x, scrollInfo.y);
 * // Output: x: 0, y: 100
 */
function getScrollInfo() {
  if (!editorV) return { x: 0, y: 0 };
  const scrollDOM = editorV.scrollDOM;
  return {
    x: scrollDOM.scrollLeft,
    y: scrollDOM.scrollTop,
  };
}

/**
 * 设置滚动位置 (Set Scroll Position)
 * This function sets the scroll position of an element to a specified x and y coordinate.
 * It is used to programmatically scroll to a specific position within the editor. 
 * @param { number } x 
 * @param { number } y
 * @returns { void }
 */
function scrollTo(x, y) {
  if (!editorV) return;
  const scrollDOM = editorV.scrollDOM;
  scrollDOM.scrollTo(x, y);
}

watch(
  () => props.modelValue,
  (val, oVal) => {
    if (editorV.hasFocus || val === oVal) {
      return;
    }
    editorV.dispatch({
      changes: {
        from: 0,
        to: editorV.state.doc.length,
        insert: props.modelValue,
      },
    });
    formItem?.validate?.('change');
  },
);

function getEditor(){
  return editorV;
}

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  editorV?.destroy();
});

defineExpose({
  getScrollInfo,
  scrollTo,
  getEditor,
});
</script>

<template>
  <div class="h-full w-full">
    <div ref="editorRef" class="editor"></div>
  </div>
</template>

<style scoped>
.editor,
:deep(.editor .cm-editor) {
  height: 100%;
}
</style>
