<script lang="js" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { minimalSetup, EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { placeholder } from '@codemirror/view';
import { useFormItem } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const { formItem } = useFormItem();
const inputRef = ref();
let editorV = undefined;

function emitUpdateModelValue(e) {
  emit('update:modelValue', e.state.doc.toString());
}

function initEditor() {
  editorV = new EditorView({
    doc: props.modelValue,
    extensions: [
      minimalSetup,
      EditorView.lineWrapping,
      placeholder('请输入'),
      EditorState.transactionFilter.of((tr) => {
        return tr.newDoc.lines > 1 ? [] : [tr];
      }),
      EditorView.updateListener.of((e) => {
        emitUpdateModelValue(e);
      }),
      EditorView.theme({
        '.cm-content': {
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
        },
      }),
    ],
    parent: inputRef.value,
  });
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

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  editorV?.destroy();
});
</script>

<template>
  <div class="w-full overflow-auto font-mono">
    <div ref="inputRef"></div>
  </div>
</template>

<style>
.cm-editor {
  font-family: Arial, monospace;
}
</style>
