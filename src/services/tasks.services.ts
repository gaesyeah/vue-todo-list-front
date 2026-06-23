import type { Task, TaskDTO } from '@/types/task.types';
import axios from 'axios';

const route = 'http://localhost:3000/tasks';

export default class TasksService {
  public static async readById(id: string) {
    const tasks = await axios.get<Task>(`${route}/${id}`);
    return tasks.data;
  }

  public static async readAll() {
    const task = await axios.get<Task[]>(route);
    return task.data;
  }

  public static async create(dto: TaskDTO) {
    const task = await axios.post<Task>(route, dto);
    return task.data;
  }

  public static async update(id: string, dto: Partial<TaskDTO>) {
    const task = await axios.patch<Task>(`${route}/${id}`, dto);
    return task.data;
  }

  public static async delete(id: string) {
    const task = await axios.delete<Task>(`${route}/${id}`);
    return task.data;
  }
}
