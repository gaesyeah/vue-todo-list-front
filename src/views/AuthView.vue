<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue';
import AuthService from '@/services/auth.service';
import type { SignInDto, SignUpDto } from '@/types/auth.types';
import { useMutation } from '@tanstack/vue-query';
import axios from 'axios';
import { useToast } from 'primevue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();

const route = useRoute();
const router = useRouter();
const isSignUp = computed(() => route.name === 'signup');

const authInputValues = ref<SignUpDto>({
  email: '',
  password: '',
  confirmPassword: '',
});

const authResponseHandler = (severity: 'success' | 'error', error?: Error) => {
  const detail = (() => {
    if (axios.isAxiosError(error)) {
      return error.response?.data.message;
    }

    if (severity === 'error') return 'Houve um erro, tente novamente!';

    if (isSignUp.value) return 'Conta criada com sucesso!';
    return 'Login feito com sucesso';
  })();

  toast.add({
    severity,
    detail,
    summary: severity === 'error' ? 'Erro' : 'Sucesso',
    life: 3000,
  });
};

const { mutate: signIn, isPending: isSignInLoading } = useMutation({
  mutationFn: (dto: SignInDto) => AuthService.signIn(dto),
  onSuccess: (data) => {
    authResponseHandler('success');
    localStorage.setItem('token', data.accessToken);
    router.push({ name: 'tasks' });
  },
  onError: (error) => authResponseHandler('error', error),
});
const { mutate: signUp, isPending: isSignUpLoading } = useMutation({
  mutationFn: (dto: SignUpDto) => AuthService.signUp(dto),
  onSuccess: () => {
    authResponseHandler('success');
    router.push({ name: 'signin' });
  },
  onError: (error) => authResponseHandler('error', error),
});

const isLoading = computed(() => (isSignUp ? isSignUpLoading.value : isSignInLoading.value));

const buttonText = computed(() => {
  if (isLoading.value) return 'Carregando...';
  if (isSignUp.value) return 'Cadastrar';
  return 'Entrar';
});
</script>

<template>
  <div class="auth-container">
    <form
      class="auth-form-container"
      @submit.prevent="() => (isSignUp ? signUp(authInputValues) : signIn(authInputValues))"
    >
      <BaseInput
        v-model="authInputValues.email"
        type="email"
        label="email"
        placeholder="Digite um email"
        required
        :isLoading="isLoading"
      />
      <BaseInput
        v-model="authInputValues.password"
        type="password"
        label="senha"
        placeholder="digite uma senha"
        required
        :isLoading="isLoading"
      />
      <BaseInput
        v-if="isSignUp"
        v-model="authInputValues.confirmPassword"
        type="password"
        label="confirme a senha"
        placeholder="digite uma senha"
        required
        :isLoading="isLoading"
      />

      <button :disabled="isLoading" class="auth-button">
        {{ buttonText }}
      </button>

      <RouterLink class="auth-link" v-if="!isSignUp" to="/auth/signup"
        >Não tem uma conta? Cadastre-se!</RouterLink
      >
      <RouterLink class="auth-link" v-if="isSignUp" to="/auth/signin"
        >Já tem uma conta? faça login!</RouterLink
      >
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid gray;
  border-radius: 20px;
  max-width: 400px;
  width: 85%;
  padding: 30px;
  gap: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.auth-form-container :deep(input) {
  height: 40px;
  padding-left: 8px;
}
.auth-form-container :deep(input::placeholder) {
  font-size: 18px;
}
.auth-form-container :deep(label) {
  font-size: 18px;
}

.auth-link {
  font-size: 15px;
  color: black;
}

.auth-button {
  height: 40px;
  font-size: 18px;
  width: 100%;
  border-radius: 10px;
  border: none;
  background-color: lightgreen;
  cursor: pointer;
}
.auth-button:disabled {
  cursor: not-allowed;
  background-color: lightgray;
}
.auth-button:hover {
  opacity: 0.85;
}
</style>
