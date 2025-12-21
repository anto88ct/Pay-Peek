import { FormControl } from '@angular/forms';

export interface SignupDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    job?: string;
    nationality?: string;
    city?: string;
}

export type SignupFormDto = {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    job: FormControl<string | null>;
    nationality: FormControl<string | null>;
    city: FormControl<string | null>;
};

export class SignupMapper {
    static toDTO(form: SignupFormDto): SignupDto {
        return {
            firstName: form.firstName.value || '',
            lastName: form.lastName.value || '',
            email: form.email.value || '',
            password: form.password.value || '',
            confirmPassword: form.confirmPassword.value || '',
            job: form.job.value || undefined,
            nationality: form.nationality.value || undefined,
            city: form.city.value || undefined,
        };
    }
}
