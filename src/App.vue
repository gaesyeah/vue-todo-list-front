<script setup lang="ts">
import type { TaskDTO } from './types/task.types';
import { computed, ref } from 'vue';
import BaseInput from './components/BaseInput.vue';
import TaskItem from './components/TaskItem.vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import TasksService from './services/tasks.services.ts';
import { Toast, useToast } from 'primevue';
import axios, { AxiosError } from 'axios';

const queryKey: string[] = ['tasks'];

const toast = useToast();

const taskErrorHandler = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    const detail = (() => {
      switch (status) {
        case 409:
          return 'Já existe uma tarefa com esse nome';
        case 404:
          return 'Não existe uma tarefa com esse id';
        default:
          return 'Algo deu errado';
      }
    })();

    toast.add({
      severity: 'error',
      summary: 'Erro!',
      life: 3000,
      detail,
    });
  }
};

const queryClient = useQueryClient();
const taskSuccessHandler = (key: 'create' | 'update' | 'delete') => {
  queryClient.invalidateQueries({ queryKey });

  const detailKey = (() => {
    switch (key) {
      case 'create':
        return 'criada';
      case 'delete':
        return 'deletada';
      case 'update':
        return 'editada';
    }
  })();
  const summary = `${detailKey.charAt(0).toUpperCase()}${detailKey.slice(1)}!`;
  toast.add({
    severity: 'success',
    summary,
    life: 3000,
    detail: `Tarefa ${detailKey} com sucesso`,
  });
};

const newTaskInputValue = ref<TaskDTO>({ name: '', description: '', isTaskDoneStatus: false });

const { data: tasks, isLoading: isLoadingTasks } = useQuery({
  queryFn: TasksService.readAll,
  queryKey,
});

const { mutate: createTask, isPending: isCreatingTask } = useMutation({
  mutationFn: (dto: TaskDTO) => TasksService.create(dto),
  onError: taskErrorHandler,
  onSuccess: async () => {
    taskSuccessHandler('create');
    newTaskInputValue.value = { name: '', description: '', isTaskDoneStatus: false };
  },
});

const { mutate: deleteTask, isPending: isDeletingTask } = useMutation({
  mutationFn: (id: string) => TasksService.delete(id),
  onSuccess: () => taskSuccessHandler('delete'),
  onError: taskErrorHandler,
});

const { mutate: updateTask, isPending: isUpdatingTask } = useMutation({
  mutationFn: ({ id, dto }: { id: string; dto: Partial<TaskDTO> }) => TasksService.update(id, dto),
  onSuccess: () => taskSuccessHandler('update'),
  onError: taskErrorHandler,
});

const isRequestsLoading = computed(
  () =>
    isLoadingTasks.value || isCreatingTask.value || isDeletingTask.value || isUpdatingTask.value,
);

const taskNameAlreadyExists = (name: string, excludeId?: string) => {
  if (!name.trim()) return false;
  return !!tasks.value?.some(
    (task) => task.name.toLowerCase() === name.trim().toLowerCase() && task.id !== excludeId,
  );
};

const isNewTaskInvalid = (task: TaskDTO) => {
  const newName = task.name;
  const newDescription = task.description;

  if (!newName || !newDescription) return true;

  if (taskNameAlreadyExists(newName)) return true;

  return false;
};
</script>

<template>
  <Toast />

  <header class="header"><p>Vue TodoList</p></header>

  <div class="main-container">
    <div>
      <form class="task-form" @submit.prevent="() => createTask(newTaskInputValue)">
        <BaseInput
          class="task-input"
          label="nome da tarefa"
          placeholder="digite o nome da tarefa"
          v-model="newTaskInputValue.name"
          required
          :isLoading="isRequestsLoading"
          :errorMessage="{
            validation: taskNameAlreadyExists(newTaskInputValue.name),
            message: 'Já existe uma tarefa com esse nome',
          }"
        />

        <BaseInput
          class="task-input"
          label="nome da descrição"
          placeholder="digite a descrição da tarefa"
          v-model="newTaskInputValue.description"
          required
          :isLoading="isRequestsLoading"
        />

        <button
          class="create-task-button"
          type="submit"
          :disabled="isNewTaskInvalid(newTaskInputValue) || isRequestsLoading"
        >
          {{ isRequestsLoading ? 'Carregando...' : 'Adicionar' }}
        </button>
      </form>
    </div>

    <ul class="task-list-container">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :isLoading="isRequestsLoading"
        :taskNameAlreadyExists="taskNameAlreadyExists"
        @delete="deleteTask"
        @update="(id, dto) => updateTask({ id, dto })"
      />
    </ul>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  background-color: lightgreen;
}

.main-container {
  margin-top: 30px;
  gap: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.task-list-container {
  display: flex;
  gap: 30px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  padding: 15px;
  border: 2px solid gray;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

:deep(.task-input) {
  height: 30px;
}

.create-task-button {
  font-size: 16px;
  height: 33px;
  border: none;
  border-radius: 10px;
  background-color: lightgreen;
  cursor: pointer;
}
.create-task-button:disabled {
  background-color: lightgrey;
  cursor: not-allowed;
}
</style>
