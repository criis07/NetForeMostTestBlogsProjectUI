import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validador personalizado para comparar contraseñas
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Si las contraseñas no coinciden, devuelve un error
    return password === confirmPassword ? null : { mismatch: true };
  };
}
