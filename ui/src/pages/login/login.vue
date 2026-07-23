<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@src/api/index';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { SESSIONSTORAGE_KEYS, setSession } from '@src/utils/sessionstorage';

const router = useRouter();

const formRef = ref();
const form = ref({
  username: 'admin',
  password: 'admin',
});
const rules = ref({
  username: [
    { required: true, message: 'Enter your account', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Enter your password', trigger: 'blur' },
  ],
});
const loading = ref(false);

async function handleSubmit() {
  try {
    loading.value = true;
    await formRef.value.validate();
    const loginRes = await login(form.value);
    const token = loginRes.token;
    setSession(SESSIONSTORAGE_KEYS.TOKEN, token);
    ElMessage.success('Logged in successfully');
    router.replace('/');
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="flex h-lvh items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100"
  >
    <div
      class="relative flex h-full w-full items-center justify-center p-4 md:h-auto md:w-[420px]"
    >
      <!-- Background decoration -->
      <div
        class="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-xl"
      ></div>
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/5"
      ></div>

      <!-- Login box -->
      <div class="relative w-full rounded-2xl bg-white p-8 shadow-2xl">
        <div class="flex flex-col items-center pb-8">
          <div class="text-3xl font-bold tracking-wider text-gray-800">
            RuleGo-Server
          </div>
        </div>
        <div>
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            :hide-required-asterisk="true"
            @submit.prevent="handleSubmit"
            class="px-4"
          >
            <el-form-item prop="username">
              <el-input
                placeholder="Enter your account"
                v-model="form.username"
                :prefix-icon="User"
                :clearable="true"
                size="large"
                class="custom-input"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                placeholder="Enter your password"
                v-model="form.password"
                :prefix-icon="Lock"
                :clearable="true"
                :show-password="true"
                size="large"
                class="custom-input"
              />
            </el-form-item>
            <el-button
              class="custom-button w-full"
              type="primary"
              size="large"
              @click="handleSubmit"
            >
              <span class="font-bold tracking-wider">Log In</span>
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-white/50 py-2 text-center text-xs text-gray-400 backdrop-blur-sm"
  >
    Copyright © 2025
    <a
      href="https://github.com/rulego/rulego-server"
      target="_blank"
      style="color: #666; text-decoration: none"
      >RuleGo-Server</a
    >. All rights reserved.
    <a
      href="https://rulego.cc"
      target="_blank"
      class="text-blue-500 hover:underline"
      >Powered by RuleGo</a
    >
  </footer>
</template>

<style scoped>
.custom-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e5e7eb inset;
  border-radius: 0.75rem;
  padding: 0 1rem;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #3b82f6 inset;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3b82f6 inset;
}

.custom-input :deep(.el-input__inner) {
  height: 44px;
}

.custom-button {
  height: 44px;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  border: none;
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.custom-button:active {
  transform: translateY(0);
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__error) {
  padding-top: 6px;
  font-size: 0.875rem;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
