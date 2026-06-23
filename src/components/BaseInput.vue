<script setup lang="ts">
import { ref, type ClassValue } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const model = defineModel<string>();

const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
defineExpose({
  focus: () => inputRef.value?.focus(),
});

const inputId = uuidv4();

defineProps<{
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  class?: ClassValue;
  errorMessage?: { validation: boolean; message: string };
  type?: 'text' | 'number' | 'textarea';
}>();
</script>

<template>
  <div class="input-container">
    <div class="label-container">
      <label v-if="label" :for="inputId">{{ label }}{{ required ? '*' : '' }}</label>

      <input
        v-if="type !== 'textarea'"
        class="input"
        ref="inputRef"
        v-model="model"
        :type="type ?? 'text'"
        :class="class"
        :disabled="disabled"
        :id="inputId"
        :placeholder="placeholder"
        :required="required"
      />

      <textarea
        v-if="type === 'textarea'"
        class="input"
        ref="inputRef"
        v-model="model"
        :class="class"
        :disabled="disabled"
        :id="inputId"
        :placeholder="placeholder"
        :required="required"
      />
    </div>

    <p class="error-message" v-if="errorMessage?.validation">
      {{ errorMessage?.message }}
    </p>
  </div>
</template>

<style scoped>
.input-container {
  width: 100%;
}

.input {
  height: 22px;
  border-radius: 8px;
  padding-left: 5px;
  font-size: 14px;
  border: 2px solid gray;
}
.input::placeholder {
  font-size: 14px;
}

.label-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.error-message {
  font-size: 12px;
  color: red;
}
</style>
