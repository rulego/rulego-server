<script lang="js" setup>
import MenuLayout from '@src/layout/components/default/menu.vue';
</script>

<template>
  <div class="flex h-screen w-screen overflow-auto">
    <div class="w-52 flex-none">
      <menu-layout></menu-layout>
    </div>
    <div class="flex-grow overflow-auto">
      <slot></slot>
    </div>
  </div>
</template>
