<template>
  <div class="flex flex-col p-4">
    <el-form :model="gptConfig" :rules="rules" ref="formRef" label-width="7em" class="mb-4">
      <el-form-item label="Base URl" prop="url">
        <el-input placeholder="Base URl" v-model="gptConfig.url" clearable />
      </el-form-item>
      <el-form-item label="Api Key" prop="apiKey">
        <el-input type="password" placeholder="Api key" v-model="gptConfig.apiKey" show-password clearable />
      </el-form-item>
      <el-form-item label="Model" prop="model">
        <el-input placeholder="Model" v-model="gptConfig.model" clearable />
      </el-form-item>
    </el-form>
    <BubbleList class="flex-1 " :list="list" max-height="auto" />
    <Sender ref="senderRef" v-model="inputMessage" @submit="handleSend" />
  </div>
</template>

<script lang="ts" setup>
import OpenAI from 'openai';
import { onMounted, reactive, Ref, ref, watch } from 'vue';
import { BubbleList, Sender } from 'vue-element-plus-x';
import type { BubbleListItemProps, BubbleListProps } from 'vue-element-plus-x/types/components/BubbleList/types';

const gptConfig = reactive({
  url: 'https://api.deepseek.com',
  apiKey: '',
  model: 'deepseek-chat',
});

const rules = {
  url: [{ required: true, message: 'Base URL is required', trigger: 'blur' }],
  apiKey: [{ required: true, message: 'API Key is required', trigger: 'blur' }],
  model: [{ required: true, message: 'Model is required', trigger: 'blur' }],
};

const formRef = ref();

const inputMessage = ref('');

let openai: OpenAI;

const senderRef = ref<InstanceType<typeof Sender>>();

type listType = BubbleListItemProps & {
  key: number;
  role: 'user' | 'ai';
};

const list: Ref<BubbleListProps<listType>['list']> = ref([]);

// 初始化 OpenAI 实例
function initOpenAi() {
  openai = new OpenAI({
    baseURL: gptConfig.url,
    apiKey: gptConfig.apiKey,
    dangerouslyAllowBrowser: true,
  });
}

// 处理发送消息
async function handleSend(val: string) {
  formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return;
    }
    senderRef.value.clear();
    // 添加用户消息到列表
    list.value.push({
      key: list.value.length + 1,
      role: 'user',
      placement: 'end',
      content: val,
      loading: false,
      shape: 'corner',
      variant: 'outlined',
      isMarkdown: true,
      typing: false,
      avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4',
      avatarSize: '24px',
    });

    // 调用 OpenAI 接口
    openai.chat.completions
      .create({
        messages: [
          {
            role: 'user',
            content: val,
          },
        ],
        model: gptConfig.model,
      })
      .then((response) => {
        // 添加 AI 回复到列表
        list.value.push({
          key: list.value.length + 1,
          role: 'ai',
          placement: 'start',
          content: response.choices[0].message.content,
          loading: false,
          shape: 'corner',
          variant: 'filled',
          isMarkdown: true,
          typing: false,
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          avatarSize: '24px',
        });
      });
  });
}

// 监听配置变化并重新初始化 OpenAI
watch(
  () => [gptConfig.apiKey, gptConfig.url,gptConfig.model],
  () => {
    initOpenAi();
    localStorage.setItem('gptConfig', JSON.stringify(gptConfig));
  }
);

// 初始化时调用
onMounted(() => {
  const storedConfig = localStorage.getItem('gptConfig');
  if (storedConfig) {
    const parsedConfig = JSON.parse(storedConfig);
    Object.assign(gptConfig, parsedConfig);
  }
  initOpenAi();
});
</script>
