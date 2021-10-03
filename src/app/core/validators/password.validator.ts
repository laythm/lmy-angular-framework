import { FormControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class PasswordValidator {

    public static password(control: FormControl): ValidationResult {
        if (control.value) {
            let hasNumber = /\d/.test(control.value);

            let hasUpper = /[A-Z]/.test(control.value);
            let hasLower = /[a-z]/.test(control.value);
            let hasNonASCII  = /[^A-Za-z0-9_,.-]/.test(control.value);

            const valid = hasNumber && ((hasUpper && hasLower) || hasNonASCII);
            if (!valid) {
                return { password: true };
            }
        }

        return null;
    }
}