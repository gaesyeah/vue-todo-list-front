export type SignUpDto = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInDto = Omit<SignUpDto, 'confirmPassword'>;

export type SignInResponse = { accessToken: string; email: string };
