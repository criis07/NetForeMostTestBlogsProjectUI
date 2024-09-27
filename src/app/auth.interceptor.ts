import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');  // Obtener el token del almacenamiento local
  const apiKey = 'ec880424-5ae9-4b04-8aec-ce1aefa10e22';  // Tu x-api-key

  // Clonar la solicitud original y añadir los encabezados necesarios
  let modifiedReq = req.clone({
    setHeaders: {
      'x-api-key': apiKey  // Añadir x-api-key
    }
  });

  // Si hay un token, añadir el encabezado Authorization
  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // Añadir el token de autorización
      }
    });
  }

  // Continuar con la solicitud modificada
  return next(modifiedReq);
};
