import { FormControl } from '@angular/forms';

export interface LoginDto {
  email: string;
  password: string;
}

export type LoginFormDto = {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  rememberMe: FormControl<boolean | null>;
};

export class LoginMapper {
  static toDTO(form: LoginFormDto): LoginDto {
    return {
      email: (form.email.value || '').trim(),
      password: form.password.value || ''
    };
  }
}
