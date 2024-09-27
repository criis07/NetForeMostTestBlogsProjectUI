import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../helpers/custom-validators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  styleUrls: [],
  imports: [ReactiveFormsModule, CommonModule,MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,]
})
export class AuthComponent {
  authForm: FormGroup;
  isLoginMode = true; // Controla el modo de login y registro
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      name: [''], // Solo se usa en registro
      lastName: [''] // Solo se usa en registro
    });

    // Establecer validadores según el modo
    this.authForm.setValidators(this.isLoginMode ? null : passwordMatchValidator());
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();

    // Re-aplicar validadores cuando cambia el modo
    this.authForm.setValidators(this.isLoginMode ? null : passwordMatchValidator());
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
  
    // Verificar si hay un error de coincidencia solo en el modo de registro
    if (!this.isLoginMode && this.authForm.errors?.['mismatch']) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
  
    const authData = {
      email: this.authForm.value.email,
      password: this.authForm.value.password
    };
  
    const registerData = {
      name: this.authForm.value.name,
      lastName: this.authForm.value.lastName,
      email: this.authForm.value.email,
      password: this.authForm.value.password,
      confirmPassword: this.authForm.value.confirmPassword
    };
  
    if (this.isLoginMode) {
      this.authService.login(authData.email, authData.password).subscribe(
        response => {
          // Maneja el inicio de sesión exitoso
        },
        error => {
          this.errorMessage = error; // Manejo de errores
        }
      );
    } else {
      this.authService.signUp(registerData).subscribe(
        response => {
          // Maneja el registro exitoso
        },
        error => {
          this.errorMessage = error; // Manejo de errores
        }
      );
    }
  }
}
