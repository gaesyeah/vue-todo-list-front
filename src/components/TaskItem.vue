<script setup lang="ts">
import type { Task } from '@/types/task.types';

const emit = defineEmits<{
  remove: [id: string];
}>();

defineProps<{
  task: Task;
}>();
</script>

<template>
  <li class="task-item">
    <p>{{ task.name }}</p>
    <p class="description">{{ task.description }}</p>

    <button @click="emit('remove', task.id)" class="delete-icon-button">
      <i class="pi pi-trash"></i>
    </button>
  </li>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  border: 2px solid gray;
  border-radius: 10px;
  padding: 10px;
  width: 150px;
  overflow-wrap: break-word;
  word-break: break-word;
  position: relative;
}

.delete-icon-button {
  font-size: 15px;
  color: red;
  border: 2px solid gray;
  background-color: white;
  border-radius: 100%;
  cursor: pointer;
  position: absolute;
  right: -9px;
  top: -9px;
}
.delete-icon-button:hover {
  background-color: gray;
  transition: 400ms;
}

.description {
  font-size: 14px;
}
</style>
