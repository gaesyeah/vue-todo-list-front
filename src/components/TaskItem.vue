<script setup lang="ts">
import type { Task, TaskDTO } from '@/types/task.types';
import { ref } from 'vue';
import BaseInput from './BaseInput.vue';

const emit = defineEmits<{
  delete: [id: string];
  update: [id: string, task: Partial<TaskDTO>];
}>();

const props = defineProps<{
  task: Task;
  isLoading?: boolean;
  taskNameAlreadyExists: (name: string, excludeId?: string) => boolean;
}>();

const updateTaskInputValue = ref<Task>({ ...props.task });

const isUpdateEnabled = ref<boolean>(false);
const updateTask = () => {
  isUpdateEnabled.value = !isUpdateEnabled.value;

  const updatedTaskHasNoChanges =
    updateTaskInputValue.value.name === props.task.name &&
    updateTaskInputValue.value.description === props.task.description;

  if (updatedTaskHasNoChanges) return;

  if (!isUpdateEnabled.value) {
    emit('update', props.task.id, updateTaskInputValue.value);
  }
};
</script>

<template>
  <li
    :class="{
      'task-item': true,
      'task-item-gap': isUpdateEnabled,
    }"
  >
    <BaseInput
      v-model="updateTaskInputValue.name"
      :class="{ 'updating-input': !isUpdateEnabled }"
      :disabled="!isUpdateEnabled"
      :isLoading="isLoading"
      :errorMessage="{
        validation: taskNameAlreadyExists(updateTaskInputValue.name, props.task.id),
        message: 'Já existe uma tarefa com esse nome',
      }"
    />

    <hr v-if="!isUpdateEnabled" />

    <BaseInput
      type="textarea"
      v-model="updateTaskInputValue.description"
      :class="{ 'updating-input': !isUpdateEnabled }"
      :disabled="!isUpdateEnabled"
      :isLoading="isLoading"
    />

    <button
      @click="emit('delete', task.id)"
      class="icon-button delete-icon-button"
      :disabled="isLoading"
    >
      <i class="pi pi-trash"></i>
    </button>

    <button
      @click="updateTask"
      class="icon-button update-icon-button"
      :disabled="
        Object.values(updateTaskInputValue).some((value) => !value) ||
        taskNameAlreadyExists(updateTaskInputValue.name, props.task.id) ||
        isLoading
      "
    >
      <i
        class="pi"
        :class="{
          'pi-check-square check-icon': isUpdateEnabled,
          'pi-pen-to-square update-icon': !isUpdateEnabled,
        }"
      ></i>
    </button>
  </li>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 2px solid gray;
  border-radius: 10px;
  padding: 15px;
  position: relative;
}
.task-item-gap {
  gap: 18px;
}

hr {
  color: gray;
  width: 100%;
}

:deep(.updating-input) {
  border: 2px solid transparent;
}
:deep(.updating-input):disabled {
  color: black;
}

.delete-icon-button {
  color: red;
  top: -9px;
}
.update-icon-button {
  bottom: -9px;
}
.update-icon {
  color: blue;
}
.check-icon {
  color: green;
}
.icon-button {
  right: -9px;
  font-size: 15px;
  border: 2px solid gray;
  background-color: white;
  border-radius: 100%;
  cursor: pointer;
  position: absolute;
}
.icon-button:hover {
  background-color: gray;
  transition: 400ms;
}
.icon-button:disabled {
  cursor: not-allowed;
  background-color: white;
}
</style>
