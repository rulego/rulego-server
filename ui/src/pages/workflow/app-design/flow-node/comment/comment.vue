<script setup>
import DefaultNode from '@src/pages/workflow/app-design/flow-node/components/default-node.vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import { Extension } from '@tiptap/core';
import { debounce } from 'lodash';

const props = defineProps({
  /**
   * 节点属性(每个节点必定有的属性)
   * @type {Object}
   * @property {Object} formData 表单
   * @property {string} formData.description 描述
   * @property {string} formData.title 标题
   * @property {Object} status 状态
   * @property {boolean} status.isSelected 是否选中
   */
  properties: Object,
  model: Object,
});

const isSelected = computed(() => {
  return props.properties?.status?.isSelected;
});

const computedContentHeight = computed(() => {
  const totalHeight = props.properties.height || 200;
  const toolbarHeight = 41;
  return totalHeight - toolbarHeight;
});

const FontSizeExtension = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: 'normal',
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

const editor = ref(null);
const showFontSizes = ref(false);
const editorContainerRef = ref(null);

const fontSizes = [
  { label: '小', value: '12px' },
  { label: '中', value: '14px' },
  { label: '大', value: '16px' },
];

// 动态保存编辑器内容
const debouncedSave = debounce(function () {
  try {
    if (editor.value) {
      const content = editor.value.getHTML();
      props.model.updateProperties({
        ...props.properties,
        formData: {
          ...props.properties.formData,
          description: content,
        },
      });
    }
  } catch (error) {
    console.error('保存编辑器内容失败:', error);
  }
}, 300);

onMounted(() => {
  editor.value = new Editor({
    // 重载编辑器
    content: props.properties.formData.description || '',
    extensions: [
      StarterKit.configure({
        bulletList: false,
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'editor-list',
        },
      }),
      TextStyle,
      FontSizeExtension,
      Link.configure({
        openOnClick: false,
      }),
    ],
    editorProps: {
      handleDOMEvents: {
        mousedown: (view, event) => {
          if (event.target.closest('.editor-paragraph:not(:empty)')) {
            event.stopPropagation();
          }
          return false;
        },
      },
    },
    onUpdate: () => {
      debouncedSave();
    },
  });

  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  editor.value?.destroy();
  document.removeEventListener('click', handleClickOutside);
});

function setFontSize(size) {
  editor.value?.chain().focus().setMark('textStyle', { fontSize: size }).run();
  showFontSizes.value = false;
}

function setLink() {
  const url = window.prompt('请输入链接地址：');
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run();
  }
}

function handleClickOutside(event) {
  if (!event.target.closest('.font-size-dropdown')) {
    showFontSizes.value = false;
  }
}
</script>

<template>
  <DefaultNode
    :properties="props.properties"
    :model="props.model"
    :class="{ 'border-blue-500': isSelected }"
  >
    <div class="comment-node">
      <div class="toolbar">
        <div class="flex-toolbar">
          <!-- 字体大小按钮 -->
          <div class="font-size-dropdown">
            <button class="toolbar-btn" @click="showFontSizes = !showFontSizes">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill="currentColor"
                stroke="none"
              >
                <text x="1" y="26" font-size="32" font-family="Arial">A</text>
                <text x="20" y="28" font-size="22" font-family="Arial">a</text>
              </svg>
            </button>
            <div v-if="showFontSizes" class="font-size-menu">
              <div
                v-for="size in fontSizes"
                :key="size.value"
                class="font-size-item"
                @click="setFontSize(size.value)"
              >
                {{ size.label }}
              </div>
            </div>
          </div>

          <!-- 加粗按钮 -->
          <button
            class="toolbar-btn"
            :class="{ active: editor?.isActive('bold') }"
            @click="editor?.chain().focus().toggleBold().run()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </svg>
          </button>

          <!-- 斜体按钮 -->
          <button
            class="toolbar-btn"
            :class="{ active: editor?.isActive('italic') }"
            @click="editor?.chain().focus().toggleItalic().run()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="19" y1="4" x2="10" y2="4" />
              <line x1="14" y1="20" x2="5" y2="20" />
              <line x1="15" y1="4" x2="9" y2="20" />
            </svg>
          </button>

          <!-- 删除线按钮 -->
          <button
            class="toolbar-btn"
            :class="{ active: editor?.isActive('strike') }"
            @click="editor?.chain().focus().toggleStrike().run()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.8 3.3 3.6 3.9h.2m8.2 3.7c.3.4.4.8.4 1.3 0 2.9-2.7 3.6-5.3 3.6-2.2 0-4.1-.4-6.3-1.1"
              />
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </button>

          <!-- 链接按钮 -->
          <button
            class="toolbar-btn"
            :class="{ active: editor?.isActive('link') }"
            @click="setLink"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              />
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              />
            </svg>
          </button>

          <!-- 列表按钮 -->
          <button
            class="toolbar-btn"
            :class="{ active: editor?.isActive('bulletList') }"
            @click="editor?.chain().focus().toggleBulletList().run()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="2" />
              <circle cx="4" cy="12" r="2" />
              <circle cx="4" cy="18" r="2" />
            </svg>
          </button>
        </div>
      </div>

      <div
        class="editor-container"
        ref="editorContainerRef"
        :style="{ height: computedContentHeight + 'px' }"
      >
        <editor-content :editor="editor" class="content-area" />
      </div>
    </div>
  </DefaultNode>
</template>

<style scoped>
.toolbar {
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  cursor: default;
  padding: 4px;
  height: 32px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.flex-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  min-width: 240px;
  max-width: 100%;
  justify-content: center;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  padding: 6px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
  color: #1a56db;
}

.toolbar-btn.active {
  background-color: #e5e7eb;
  color: #1a56db;
}

.editor-container {
  padding: 8px;
  height: calc(100% - 41px);
  display: flex;
  flex-direction: column;
}

.content-area {
  height: 100%;
}

:deep(.ProseMirror) {
  outline: none;
  height: 100%;
}

.font-size-dropdown {
  position: relative;
}

.font-size-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.font-size-item {
  padding: 4px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.font-size-item:hover {
  background-color: #f3f4f6;
}

.editor-paragraph:not(:empty) {
  cursor: text;
  user-select: text;
  padding: 2px 0;
}

.editor-paragraph:empty {
  cursor: move;
  user-select: none;
  min-height: 24px;
}

:deep(.ProseMirror a) {
  color: #409eff;
  text-decoration: none;
}

:deep(.ProseMirror a:hover) {
  text-decoration: underline;
}

:deep(.editor-list) {
  padding-left: 1rem;
  margin: 0.5rem 0;
}

:deep(.editor-list-item) {
  margin: 0.2rem 0;
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5em;
}

:deep(li) {
  list-style-type: inherit;
}
</style>
