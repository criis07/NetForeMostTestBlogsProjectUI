import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../app/auth.service'; // Asegúrate de que la ruta sea correcta

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const router = inject(Router);           // Inyecta el router

  if (authService.isLoggedIn()) {
    return true;  // Permitir acceso si está autenticado
  } else {
    console.log("No autenticado");
    router.navigate(['/auth']);  // Redirigir a la página de login
    return false;
  }
};
