import api from './api';
import type { SignInDto, SignInResponse, SignUpDto } from '@/types/auth.types';

const route = 'auth';

export default class AuthService {
  public static async signIn(dto: SignInDto) {
    const task = await api.post<SignInResponse>(`${route}/signin`, dto);
    return task.data;
  }

  public static async signUp(dto: SignUpDto) {
    const task = await api.post(`${route}/signup`, dto);
    return task.data;
  }
}
