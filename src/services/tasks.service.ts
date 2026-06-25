import type { Task, TaskDTO } from '@/types/task.type';
import api from './api';

const route = 'tasks';

export default class TasksService {
  public static async readAllByUser() {
    const task = await api.get<Task[]>(route);
    return task.data;
  }

  public static async create(dto: TaskDTO) {
    const task = await api.post<Task>(route, dto);
    return task.data;
  }

  public static async updateById(id: string, dto: Partial<TaskDTO>) {
    const task = await api.patch<Task>(`${route}/${id}`, dto);
    return task.data;
  }

  public static async deleteById(id: string) {
    const task = await api.delete<Task>(`${route}/${id}`);
    return task.data;
  }
}
