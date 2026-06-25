<script setup lang="ts">
import type { Task, TaskDTO } from '@/types/task.type.ts';
import { computed, ref } from 'vue';
import BaseInput from './BaseInput.vue';
import Checkbox from 'primevue/checkbox';

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

const emitTaskChanges = () => {
  emit('update', props.task.id, updateTaskInputValue.value);
};

const isUpdateEnabled = ref<boolean>(false);
const updateTask = () => {
  isUpdateEnabled.value = !isUpdateEnabled.value;

  const updatedTaskHasNoChanges =
    updateTaskInputValue.value.name === props.task.name &&
    updateTaskInputValue.value.description === props.task.description;

  if (updatedTaskHasNoChanges) return;

  if (!isUpdateEnabled.value) emitTaskChanges();
};

const taskHasEmptyField = Object.entries(props.task).some(
  ([key, value]) => (key as keyof TaskDTO) !== 'isTaskDoneStatus' && !value,
);

const taskDoneStatusClass = computed(() =>
  props.task.isTaskDoneStatus ? ['pi-check-circle', 'green-icon'] : ['pi-ban', 'red-icon'],
);
</script>

<template>
  <li :class="['task-item', { 'task-item-gap': isUpdateEnabled }]">
    <i :class="['pi', 'done-overlay', taskDoneStatusClass]"></i>
    <div class="name-input-container">
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
      <Checkbox
        v-if="isUpdateEnabled"
        binary
        class="checkbox"
        v-model="updateTaskInputValue.isTaskDoneStatus"
        @change="emitTaskChanges"
        :disabled="isLoading"
      />
    </div>

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
      class="icon-button delete-icon-button red-icon"
      :disabled="isLoading"
    >
      <i class="pi pi-trash"></i>
    </button>

    <button
      @click="updateTask"
      class="icon-button update-icon-button"
      :disabled="
        taskHasEmptyField ||
        taskNameAlreadyExists(updateTaskInputValue.name, props.task.id) ||
        isLoading
      "
    >
      <i
        :class="[
          'pi',
          {
            'pi-check-square green-icon': isUpdateEnabled,
            'pi-pen-to-square update-icon': !isUpdateEnabled,
          },
        ]"
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
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.task-item-gap {
  gap: 18px;
}
.name-input-container {
  display: flex;
  position: relative;
}
.done-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.25;
  font-size: 110px;
  z-index: 1;
  pointer-events: none;
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

.checkbox {
  position: absolute;
  right: 2px;
  top: 2px;
}
:deep(.checkbox .p-checkbox-box) {
  border-radius: 7px;
}
:deep(.checkbox:not(.p-checkbox-checked) .p-checkbox-box) {
  border-color: red;
}
.delete-icon-button {
  top: -9px;
}
.update-icon-button {
  bottom: -9px;
}
.update-icon {
  color: blue;
}
.red-icon {
  color: red;
}
.green-icon {
  color: green;
}
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  right: -9px;
  width: 28px;
  height: 28px;
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
