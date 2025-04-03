<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import JsonEditor from '@src/components/json-editor/json-editor.vue';

const props = defineProps({
    modelValue: {
        type: [String, Number, Object],
        default: '',
    }
})
const emit = defineEmits(["update:modelValue"]);

const computedValue = computed(() => {
    if (typeof props.modelValue === 'string') {
       return props.modelValue; 
    } else if (typeof props.modelValue === 'object') {
        try {
            return JSON.stringify(props.modelValue, null, 2);
        } catch (e) {
            return props.modelValue;
        }
    }
    return props.modelValue;
});

function handelUpdate(val) {
    emit("update:modelValue", JSON.parse(val));
}

</script>
<template>
    <json-editor :modelValue="computedValue" @update:modelValue="handelUpdate" />
</template>
<style scoped>
.app-source-code {
    display: flex;
    flex-direction: column;
}
</style>