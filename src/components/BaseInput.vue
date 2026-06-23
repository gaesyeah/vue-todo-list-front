<script setup lang="ts">
import { ref } from 'vue';

const model = defineModel<string>();

const inputRef = ref<HTMLInputElement | null>(null);
defineExpose({
  focus: () => inputRef.value?.focus(),
});

defineProps<{
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  errorMessage?: { validation: boolean; message: string };
}>();
</script>

<template>
  <div class="input-container">
    <label class="label">
      {{ label }}
      {{ required ? '*' : '' }}

      <input
        class="input"
        v-model="model"
        ref="inputRef"
        :placeholder="placeholder"
        :required="required"
        :type="type ?? 'text'"
      />
    </label>

    <p class="error-message" v-if="errorMessage?.validation">
      {{ errorMessage?.message }}
    </p>
  </div>
</template>

<style scoped>
.input-container {
  width: 300px;
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

.label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.error-message {
  font-size: 12px;
  color: red;
}
</style>
