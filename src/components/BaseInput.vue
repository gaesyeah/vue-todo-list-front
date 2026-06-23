<script setup lang="ts">
import { computed, ref, type ClassValue } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const model = defineModel<string>();

const inputId = uuidv4();

const props = defineProps<{
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  class?: ClassValue;
  errorMessage?: { validation: boolean; message: string };
  type?: 'text' | 'number' | 'textarea';
  isLoading?: boolean;
}>();

const disabled = computed(() => props.disabled || props.isLoading);
</script>

<template>
  <div class="input-container">
    <div class="label-container">
      <label v-if="label" :for="inputId">{{ label }}{{ required ? '*' : '' }}</label>

      <input
        v-if="type !== 'textarea'"
        v-model="model"
        class="input"
        :class="[props.class, { 'input-loading': isLoading }]"
        :type="type ?? 'text'"
        :disabled="disabled"
        :id="inputId"
        :placeholder="placeholder"
        :required="required"
      />

      <textarea
        v-if="type === 'textarea'"
        v-model="model"
        class="input textarea"
        :class="[props.class, { 'input-loading': isLoading }]"
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
  height: 25px;
  border-radius: 8px;
  padding-left: 5px;
  font-size: 14px;
  border: 2px solid gray;
}
.textarea {
  height: 50px;
}
.input::placeholder {
  font-size: 14px;
}
.input-loading {
  cursor: progress;
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
