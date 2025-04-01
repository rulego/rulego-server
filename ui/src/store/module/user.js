import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

const useUserStore = defineStore('user', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

export default useUserStore;
