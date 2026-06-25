export type Task = {
  id: string;
  name: string;
  description: string;
  isTaskDoneStatus: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskDTO = Pick<Task, 'name' | 'description' | 'isTaskDoneStatus'>;
