<script lang="js" setup>
import MainLayout from '@src/layout/components/default/main.vue';
</script>

<template>
  <main-layout>
    <router-view></router-view>
 
    <div class="copyright" style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
      Copyright © 2025 <a href="https://github.com/rulego/rulego-server" target="_blank" style="color: #666; text-decoration: none;">RuleGo-Server</a>. All rights reserved.
      <a href="https://rulego.cc" target="_blank" style="color: #666; text-decoration: none;">Powered by RuleGo</a>
    </div>
  </main-layout>
</template>
