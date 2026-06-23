<script setup lang="ts">
import type { Task, TaskList } from './types/task.types';
import { computed, ref } from 'vue';
import BaseInput from './components/BaseInput.vue';
import TaskItem from './components/TaskItem.vue';
import { v4 as uuidv4 } from 'uuid';

const firstInputRef = ref<InstanceType<typeof BaseInput> | null>(null);

const tasks = ref<TaskList>([]);

const newTask = ref<Task>({ name: '', description: '', id: uuidv4() });

const addTask = () => {
  tasks.value.push({ ...newTask.value });
  newTask.value = { name: '', description: '', id: uuidv4() };
  firstInputRef.value?.focus();
};

const removeTask = (id: string) => {
  tasks.value = tasks.value.filter(({ id: taskId }) => id !== taskId);
};

const taskNameAlreadyExists = computed(() => {
  return tasks.value.some(
    ({ name }) => name.toLowerCase() === newTask.value.name.trim().toLowerCase(),
  );
});

const isNewTaskInvalid = computed(() => {
  const newName = newTask.value.name.trim();
  const newDescription = newTask.value.description.trim();

  if (!newName || !newDescription) return true;

  if (taskNameAlreadyExists.value) return true;

  return false;
});
</script>

<template>
  <header class="header"><p>Vue TodoList</p></header>

  <div class="main-container">
    <div>
      <form class="task-form" @submit.prevent="addTask">
        <BaseInput
          ref="firstInputRef"
          label="nome da tarefa"
          placeholder="digite o nome da tarefa"
          v-model="newTask.name"
          required
          :errorMessage="{
            validation: taskNameAlreadyExists,
            message: 'Já existe uma tarefa com esse nome',
          }"
        />

        <BaseInput
          label="nome da descrição"
          placeholder="digite a descrição da tarefa"
          v-model="newTask.description"
          required
        />

        <button class="add-task-button" :disabled="isNewTaskInvalid" type="submit">
          Adicionar
        </button>
      </form>
    </div>

    <ul class="task-list-container">
      <TaskItem v-for="task in tasks" :task="task" :key="task.name" @remove="removeTask" />
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
  gap: 30px;
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
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-task-button {
  font-size: 16px;
  height: 33px;
  border: none;
  border-radius: 10px;
  background-color: lightgreen;
  cursor: pointer;
}
.add-task-button:disabled {
  background-color: lightgrey;
  cursor: not-allowed;
}
</style>
