export type Task = {
  name: string;
  description: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskDTO = Pick<Task, 'name' | 'description'>;
